<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

$email = $data['email'];
$first_name = $data['firstName'];
$last_name = $data['lastName'];
$mobile = $data['phone'];

$stmt = $conn->prepare("UPDATE users SET first_name = ?, last_name = ?, mobile = ? WHERE email = ?");
$stmt->bind_param("ssss", $first_name, $last_name, $mobile, $email);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

$stmt->close();
$conn->close();
