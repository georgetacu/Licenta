<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(["error" => "Method not allowed"]);
    exit();
}

require_once("db.php");

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['auto_service_id'], $data['title'], $data['description'], $data['price'], $data['duration']) ||
    empty($data['title']) || empty($data['description'])
) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid input"]);
    exit();
}

$autoServiceId = intval($data['auto_service_id']);
$title = $conn->real_escape_string($data['title']);
$description = $conn->real_escape_string($data['description']);
$price = floatval($data['price']);
$duration = intval($data['duration']);

$sql = "INSERT INTO services (auto_service_id, title, description, price, duration_minutes)
        VALUES ('$autoServiceId', '$title', '$description', '$price', '$duration')";

if ($conn->query($sql)) {
    echo json_encode(["success" => true]);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $conn->error]);
}

$conn->close();
?>
