<?php
include 'db.php';

header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$auto_service_id = $data['auto_service_id'];
$appointment_datetime = $data['appointment_datetime'];
$service_id = $data['service_id'];

$stmt = $conn->prepare("INSERT INTO appointments (user_id, auto_service_id, appointment_datetime,service_id,status) VALUES (?, ?, ?, ?, 1)");
$stmt->bind_param("iisi", $user_id, $auto_service_id, $appointment_datetime, $service_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Failed to book appointment"]);
}
?>
