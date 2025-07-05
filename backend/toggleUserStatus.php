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

if (!isset($data['id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing parameters"]);
    exit();
}

$id = intval($data['id']);
$status = intval($data['status']);

$stmt = $conn->prepare("UPDATE users SET status = ? WHERE id = ?");
$stmt->bind_param("ii", $status, $id);

if ($stmt->execute()) {
    echo json_encode(["message" => "Status updated"]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update status"]);
}

$conn->close();
