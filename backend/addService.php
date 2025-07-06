<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST");

include 'db.php'; 

$data = json_decode(file_get_contents("php://input"), true);

$name = $data['name'] ?? null;
$description = $data['description'] ?? null;
$price = $data['price'] ?? null;
$user_id = $data['user_id'] ?? null;

if (!$name || !$description || !$price || !$user_id) {
  http_response_code(400);
  echo json_encode(["error" => "All fields are required."]);
  exit;
}

$autoServiceQuery = $conn->prepare("SELECT id FROM auto_services WHERE user_id = ?");
$autoServiceQuery->bind_param("i", $user_id);
$autoServiceQuery->execute();
$result = $autoServiceQuery->get_result();

if ($result->num_rows === 0) {
  http_response_code(400);
  echo json_encode(["error" => "No auto service registered for this user."]);
  exit;
}

$auto_service_id = $result->fetch_assoc()['id'];

$stmt = $conn->prepare("INSERT INTO services (name, description, price, auto_service_id) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssdi", $name, $description, $price, $auto_service_id);

if ($stmt->execute()) {
  echo json_encode(["success" => true]);
} else {
  http_response_code(500);
  echo json_encode(["error" => "Database error."]);
}
?>
