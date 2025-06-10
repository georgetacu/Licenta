<?php
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$user_id = $data['user_id'];
$auto_service_id = $data['auto_service_id'];
$appointment_datetime = $data['appointment_datetime'];

$stmt = $conn->prepare("INSERT INTO appointments (user_id, auto_service_id, appointment_datetime) VALUES (?, ?, ?)");
$stmt->bind_param("iis", $user_id, $auto_service_id, $appointment_datetime);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Failed to book appointment"]);
}
?>
