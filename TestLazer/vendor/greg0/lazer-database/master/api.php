<?php

// Hiển thị lỗi để debug (bỏ khi deploy)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Định nghĩa đường dẫn lưu dữ liệu (MASTER)
$dataFolder = __DIR__ . '/data';
$ticketFile = $dataFolder . '/tickets.data.json';
$userFile = $dataFolder . '/users.data.json';

// Cấu hình địa chỉ server master và slave
$masterServer = "http://localhost:8000/api.php"; // Địa chỉ master
$slaveServers = [ // Địa chỉ slave 1
    "http://localhost:8002/api.php",
    "http://localhost:8001/api.php" // Địa chỉ slave 2
];

// Đảm bảo thư mục tồn tại
if (!file_exists($dataFolder)) {
    mkdir($dataFolder, 0777, true);
}

// Tạo file JSON nếu chưa có
if (!file_exists($ticketFile)) {
    file_put_contents($ticketFile, json_encode([]));
}

if (!file_exists($userFile)) {
    file_put_contents($userFile, json_encode([]));
}

// Xử lý preflight request (tránh lỗi CORS trong React)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}


// Hàm đồng bộ dữ liệu với SLAVE
function syncToSlaves($newData, $dataType = "user")
{
    global $slaveServers;

    foreach ($slaveServers as $slave) {
        $ch = curl_init($slave . "?action=sync");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([$dataType => $newData]));
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);  // Thêm thời gian timeout

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);

        if (curl_errno($ch)) {
            error_log("🔥 CURL Error while syncing to $slave: " . curl_error($ch));
        } else {
            error_log("🔥 Syncing to $slave - Response: $response - HTTP Code: $httpCode");
        }

        curl_close($ch);

        if ($httpCode !== 200) {
            error_log("🔥 Warning: Sync failed to $slave with HTTP Code: $httpCode");
        }
    }
}



// 📌 Xử lý đăng ký
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "register") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["email"]) || !isset($input["password"])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Thiếu email hoặc mật khẩu!"]);
        exit;
    }

    $email = trim($input["email"]);
    $password = password_hash(trim($input["password"]), PASSWORD_DEFAULT);

    $users = json_decode(file_get_contents($userFile), true) ?: [];

    // Kiểm tra nếu email đã tồn tại
    foreach ($users as $user) {
        if (
            $user["email"] === $email
        ) {
            http_response_code(400);
            echo json_encode(["success" => false, "message" => "Email đã tồn tại!"]);
            exit;
        }
    }

    // Tạo người dùng mới
    $newUser = ["id" => count($users) + 1, "email" => $email, "password" => $password];
    $users[] = $newUser;

    // Ghi dữ liệu vào file
    if (file_put_contents($userFile, json_encode($users, JSON_PRETTY_PRINT)) === false) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Lỗi khi lưu dữ liệu!"]);
        exit;
    }

    // Đồng bộ với các slave
    syncToSlaves(
        $newUser,
        "user"
    );

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Đăng ký thành công!"]);
    exit;
}

// 📌 Xử lý đăng nhập
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "login") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["email"]) || !isset($input["password"])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Thiếu email hoặc mật khẩu!"]);
        exit;
    }

    $email = trim($input["email"]);
    $password = trim($input["password"]);

    $users = json_decode(file_get_contents($userFile), true) ?: [];

    foreach ($users as $user) {
        if ($user["email"] === $email && password_verify($password, $user["password"])) {
            $token = bin2hex(random_bytes(16));

            http_response_code(200);
            echo json_encode(["success" => true, "message" => "Đăng nhập thành công!", "token" => $token]);
            exit;
        }
    }

    http_response_code(401);
    echo json_encode(["success" => false, "message" => "Sai email hoặc mật khẩu!"]);
    exit;
}

// 📌 Xử lý "getTickets" (Dành cho đặt vé)
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "getTickets") {
    // Chuyển hướng GET tới một trong các slave
    $slave = $slaveServers[array_rand($slaveServers)];
    $url = $slave . $_SERVER['REQUEST_URI'];
    $response = file_get_contents($url);

    // Trả lại dữ liệu từ slave
    echo $response;
    exit;
}

// 📌 Xử lý "bookTicket" (Dành cho đặt vé)
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "bookTicket") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!isset($input["email"], $input["date"], $input["trip"], $input["price"])) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Thiếu dữ liệu!"]);
        exit;
    }

    $email = trim($input["email"]);
    $date = trim($input["date"]);
    $trip = trim($input["trip"]);
    $price = (int)$input["price"];

    $tickets = json_decode(file_get_contents($ticketFile), true) ?: [];

    $newTicket = [
        "id" => count($tickets) + 1,
        "email" => $email,
        "date" => $date,
        "trip" => $trip,
        "price" => $price
    ];
    $tickets[] = $newTicket;

    file_put_contents($ticketFile, json_encode($tickets, JSON_PRETTY_PRINT));

    syncToSlaves($newTicket, "ticket");

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Đặt vé thành công!"]);
    exit;
}

// 📌 Xử lý đồng bộ dữ liệu từ MASTER xuống SLAVE
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "sync") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ!"]);
        exit;
    }

    $users = json_decode(file_get_contents($userFile), true) ?: [];
    $users[] = $input;
    file_put_contents($userFile, json_encode($users, JSON_PRETTY_PRINT));

    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Đồng bộ thành công trên SLAVE"]);
    exit;
}

// 📌 Xử lý "getUsers" (Dành cho lấy danh sách người dùng)
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "getUsers") {
    // Chọn ngẫu nhiên một server Slave để cân bằng tải
    $slave = $slaveServers[array_rand($slaveServers)];
    $url = $slave . $_SERVER['REQUEST_URI'];

    // Lấy dữ liệu từ Slave
    $response = file_get_contents($url);

    // Trả lại dữ liệu từ Slave
    echo $response;
    exit;
}

// 📌 Xử lý "getTickets" (Dành cho lấy danh sách vé)
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "getTickets") {
    // Chọn ngẫu nhiên một server Slave để cân bằng tải
    $slave = $slaveServers[array_rand($slaveServers)];
    $url = $slave . $_SERVER['REQUEST_URI']; // Xây dựng URL yêu cầu từ Slave

    // Lấy dữ liệu từ Slave
    $response = file_get_contents($url);

    // Kiểm tra xem có lỗi không
    if ($response === false) {
        http_response_code(500);
        echo json_encode(["success" => false, "message" => "Không thể kết nối tới Slave"]);
        exit;
    }

    // Trả lại dữ liệu từ Slave
    echo $response;
    exit;
}

// Nếu không khớp route nào
http_response_code(404);
echo json_encode(["success" => false, "message" => "Yêu cầu không hợp lệ!"]);
exit;
