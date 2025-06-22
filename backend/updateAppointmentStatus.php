<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['appointment_id'], $data['status'])) {
    http_response_code(400);
    echo json_encode(["error" => "Missing parameters"]);
    exit;
}

$appointment_id = (int)$data['appointment_id'];
$status = (int)$data['status'];

if (!in_array($status, [0, 1, 2, 3])) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid status"]);
    exit;
}

$sql = "UPDATE appointments SET status = ? WHERE id = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("ii", $status, $appointment_id);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to update status"]);
}
?>
