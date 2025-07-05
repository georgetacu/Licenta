<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php'; // use shared DB connection

$data = json_decode(file_get_contents("php://input"), true);
if (!isset($data['id'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user ID"]);
    exit();
}

$id = intval($data['id']);

$stmt = $conn->prepare("UPDATE users SET status = 1 WHERE id = ?");
$stmt->bind_param("i", $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Owner approved successfully"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to approve owner"]);
}

$conn->close();
