<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"));
$userId = $data->user_id ?? null;

if (!$userId) {
    echo json_encode(["error" => "Missing user ID"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM auto_services WHERE user_id = ?");
$stmt->bind_param("i", $userId);
$stmt->execute();
$result = $stmt->get_result();

$services = [];

while ($service = $result->fetch_assoc()) {
    $serviceId = $service['id'];

    $linkedStmt = $conn->prepare("SELECT id, title, price, description, duration_minutes FROM services WHERE auto_service_id = ?");
    $linkedStmt->bind_param("i", $serviceId);
    $linkedStmt->execute();
    $linkedResult = $linkedStmt->get_result();

    $linkedServices = [];
    while ($linkedService = $linkedResult->fetch_assoc()) {
        $linkedServices[] = $linkedService;
    }

    $service['linked_services'] = $linkedServices;

    $services[] = $service;
}

echo json_encode($services);
?>
