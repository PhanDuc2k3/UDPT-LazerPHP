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
$dataFile = $dataFolder . '/tickets.data.json';

$slaveServers = [
    "http://localhost:8001/api.php",
    "http://localhost:8002/api.php"
];

// Đảm bảo thư mục tồn tại
if (!file_exists($dataFolder)) {
    mkdir($dataFolder, 0777, true);
}

// Tạo file JSON nếu chưa có
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([]));
}

// Xử lý preflight request (tránh lỗi CORS trong React)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// 📌 Đồng bộ dữ liệu từ MASTER xuống SLAVE
// 📌 Đồng bộ dữ liệu từ MASTER xuống SLAVE
function syncToSlaves($newTicket)
{
    global $slaveServers;

    foreach ($slaveServers as $slave) {
        $ch = curl_init($slave . "?action=sync");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode([$newTicket])); // Chỉ gửi vé mới, không phải tất cả vé
        curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);

        $response = curl_exec($ch);
        $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);

        // Log kết quả để kiểm tra phản hồi từ slave
        error_log("🔥 Syncing to $slave - Response: $response - HTTP Code: $httpCode");

        // Kiểm tra phản hồi thành công từ slave
        if ($httpCode !== 200) {
            error_log("❌ Sync failed with slave: $slave");
        }
    }
}


// 📌 Lấy danh sách vé đã đặt
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "getTickets") {
    $tickets = json_decode(file_get_contents($dataFile), true) ?: [];
    echo json_encode(["success" => true, "data" => $tickets]);
    exit;
}

// 📌 Xử lý đặt vé
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

    // Lấy danh sách vé hiện tại
    $tickets = json_decode(file_get_contents($dataFile), true) ?: [];

    // Thêm vé mới vào danh sách
    $newTicket = [
        "id" => count($tickets) + 1,
        "email" => $email,
        "date" => $date,
        "trip" => $trip,
        "price" => $price
    ];
    $tickets[] = $newTicket;

    // Lưu lại vào file
    file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));

    // Đồng bộ dữ liệu tới các Slave (chỉ gửi vé mới)
    syncToSlaves($newTicket);

    http_response_code(201);
    echo json_encode(["success" => true, "message" => "Đặt vé thành công!"]);
    exit;
}

// Nếu không khớp route nào
http_response_code(404);
echo json_encode(["success" => false, "message" => "Yêu cầu không hợp lệ!"]);
exit;
