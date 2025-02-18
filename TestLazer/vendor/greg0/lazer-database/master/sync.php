function syncData($slavePath)
{
$masterData = __DIR__ . "/data/";
$slaveData = __DIR__ . "/../$slavePath/data/";

// Đảm bảo thư mục slave tồn tại
if (!is_dir($slaveData)) {
mkdir($slaveData, 0777, true);
}

// Sao chép dữ liệu từ master sang slave
foreach (glob($masterData . "*.json") as $file) {
$destFile = $slaveData . basename($file);
copy($file, $destFile);
}

// Đồng bộ mã API từ Master sang Slave
$masterApiPath = __DIR__ . "/";
$slaveApiPath = __DIR__ . "/../$slavePath/";

// Sao chép các file API
$apiFiles = ['api.php', 'booking-api.php']; // Các file API cần đồng bộ
foreach ($apiFiles as $file) {
copy($masterApiPath . $file, $slaveApiPath . $file);
}

echo "✅ Đồng bộ dữ liệu và API từ master -> $slavePath thành công!\n";
}

// Đồng bộ cho các slave
syncData("slave1");
syncData("slave2");