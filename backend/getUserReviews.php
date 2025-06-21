<?php
header("Access-Control-Allow-Origin: http://localhost:5173"); // allow your frontend origin
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

$data = json_decode(file_get_contents('php://input'), true);

if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
    http_response_code(204);
    exit;
}


include 'db.php';

$data = json_decode(file_get_contents('php://input'), true);

if (!isset($data['user_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing user_id']);
    exit;
}

$user_id = (int)$data['user_id'];

$sql = "SELECT
  r.id,
  r.rating,
  r.comment,
  a.appointment_datetime,
  auto_svc.name AS auto_service_name
FROM appointment_reviews r
JOIN appointments a ON r.appointment_id = a.id
JOIN auto_services auto_svc ON a.auto_service_id = auto_svc.id
WHERE r.user_id = ?
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();

$result = $stmt->get_result();

$reviews = [];
while ($row = $result->fetch_assoc()) {
    $reviews[] = $row;
}

echo json_encode($reviews);
?>
