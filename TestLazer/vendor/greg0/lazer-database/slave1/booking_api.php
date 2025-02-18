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
$dataFile = $dataFolder . '/tickets.data.json';

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

// Xử lý đồng bộ dữ liệu từ MASTER xuống SLAVE
if ($_SERVER["REQUEST_METHOD"] === "POST" && isset($_GET["action"]) && $_GET["action"] === "sync") {
    $input = json_decode(file_get_contents("php://input"), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(["success" => false, "message" => "Dữ liệu không hợp lệ!"]);
        exit;
    }

    // Ghi nhận dữ liệu từ master xuống slave
    $tickets = json_decode(file_get_contents($dataFile), true) ?: [];

    // Thêm các vé mới từ master vào danh sách hiện tại
    foreach ($input as $ticket) {
        $tickets[] = $ticket; // Thêm vé mới vào danh sách
    }

    file_put_contents($dataFile, json_encode($tickets, JSON_PRETTY_PRINT));

    http_response_code(200);
    echo json_encode(["success" => true, "message" => "Đồng bộ thành công trên SLAVE"]);
    exit;
}

// Nếu không khớp route nào
http_response_code(404);
echo json_encode(["success" => false, "message" => "Yêu cầu không hợp lệ!"]);
exit;
