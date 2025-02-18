<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST");
header("Access-Control-Allow-Headers: Content-Type");

require 'vendor/autoload.php';

use Lazer\Classes\Database as Lazer;

$method = $_SERVER['REQUEST_METHOD'];
$input = json_decode(file_get_contents('php://input'), true);

try {
    // Tạo bảng users nếu chưa tồn tại
    if (!file_exists(__DIR__ . '/db/users.data.json')) {
        Lazer::create('users', [
            'email' => 'string',
            'password' => 'string'
        ]);
    }

    switch ($method) {
        case 'POST':
            if (isset($_GET['action']) && $_GET['action'] === 'register') {
                // Đăng ký tài khoản
                if (!isset($input['email']) || !isset($input['password'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Email and password are required"]);
                    exit;
                }

                // Kiểm tra email đã tồn tại chưa
                $existing = Lazer::table('users')->where('email', '=', $input['email'])->findAll();
                if ($existing->count() > 0) {
                    http_response_code(400);
                    echo json_encode(["error" => "Email already exists"]);
                    exit;
                }

                $user = Lazer::table('users');
                $user->email = $input['email'];
                $user->password = password_hash($input['password'], PASSWORD_BCRYPT);
                $user->save();
                echo json_encode(["message" => "User registered successfully"]);
            } elseif (isset($_GET['action']) && $_GET['action'] === 'login') {
                // Đăng nhập
                if (!isset($input['email']) || !isset($input['password'])) {
                    http_response_code(400);
                    echo json_encode(["error" => "Email and password are required"]);
                    exit;
                }

                $user = Lazer::table('users')->where('email', '=', $input['email'])->findAll();
                if ($user->count() === 0) {
                    http_response_code(401);
                    echo json_encode(["error" => "Invalid email or password"]);
                    exit;
                }

                $userData = $user->first();
                if (!password_verify($input['password'], $userData->password)) {
                    http_response_code(401);
                    echo json_encode(["error" => "Invalid email or password"]);
                    exit;
                }

                echo json_encode(["message" => "Login successful"]);
            } else {
                http_response_code(400);
                echo json_encode(["error" => "Invalid action"]);
            }
            break;

        default:
            http_response_code(405);
            echo json_encode(["error" => "Method not allowed"]);
            break;
    }
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode(["error" => $e->getMessage()]);
}
