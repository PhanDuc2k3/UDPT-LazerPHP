<?php

// Hiển thị lỗi để debug (bỏ khi deploy)
error_reporting(E_ALL);
ini_set('display_errors', 1);

// Cấu hình CORS
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header("Content-Type: application/json");

// Định nghĩa đường dẫn lưu dữ liệu (SLAVE)
$dataFolder = __DIR__ . '/data';
$userFile = $dataFolder . '/users.data.json';
$ticketFile = $dataFolder . '/tickets.data.json';  // Thêm đường dẫn dữ liệu cho vé

// Đảm bảo thư mục tồn tại
if (!file_exists($dataFolder)) {
    mkdir($dataFolder, 0777, true);
}

// Tạo file JSON nếu chưa có
if (!file_exists($userFile)) {
    file_put_contents($userFile, json_encode([]));
}

if (!file_exists($ticketFile)) {
    file_put_contents($ticketFile, json_encode([]));  // Tạo file dữ liệu vé nếu chưa có
}

// Xử lý preflight request (tránh lỗi CORS trong React)
if ($_SERVER["REQUEST_METHOD"] === "OPTIONS") {
    http_response_code(200);
    exit;
}

// 📌 Xử lý "getUsers" (Dành cho lấy danh sách người dùng)
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "getUsers") {
    $users = json_decode(file_get_contents($userFile), true) ?: [];

    // Trả lại dữ liệu người dùng
    echo json_encode(["success" => true, "data" => $users]);
    exit;
}

// 📌 Xử lý "getTickets" (Dành cho lấy danh sách vé)
if ($_SERVER["REQUEST_METHOD"] === "GET" && isset($_GET["action"]) && $_GET["action"] === "getTickets") {
    $tickets = json_decode(file_get_contents($ticketFile), true) ?: [];

    // Trả lại dữ liệu vé
    echo json_encode(["success" => true, "data" => $tickets]);
    exit;
}

// 📌 Xử lý đồng bộ dữ liệu từ MASTER (Dành cho đồng bộ từ master)
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

// Nếu không khớp route nào
http_response_code(404);
echo json_encode(["success" => false, "message" => "Yêu cầu không hợp lệ!"]);
exit;
