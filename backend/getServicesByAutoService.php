<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/db.php';

$data = json_decode(file_get_contents("php://input"), true);
$auto_service_id = $data['auto_service_id'] ?? null;

if (!$auto_service_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing auto_service_id"]);
    exit();
}

$stmt = $conn->prepare("SELECT id,title FROM services WHERE auto_service_id = ?");
$stmt->bind_param("i", $auto_service_id);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $services = [];

    while ($row = $result->fetch_assoc()) {
        $services[] = $row;
    }

    echo json_encode($services);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch services"]);
}
?>
