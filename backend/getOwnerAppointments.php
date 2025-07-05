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

if (!isset($data['owner_id'])) {
    echo json_encode([]);
    exit;
}

$owner_id = (int)$data['owner_id'];

$sql = "
SELECT
  a.id,
  a.appointment_datetime,
  a.status,
  CONCAT(u.first_name, ' ', u.last_name) AS user_name,
  s.title AS service_title,
  auto_svc.id AS auto_service_id,
  auto_svc.name AS auto_service_name
FROM appointments AS a
JOIN users AS u ON a.user_id = u.id
JOIN services AS s ON a.service_id = s.id
JOIN auto_services AS auto_svc ON a.auto_service_id = auto_svc.id
WHERE auto_svc.user_id = ?
ORDER BY a.appointment_datetime DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $owner_id);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];

while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode($appointments);
