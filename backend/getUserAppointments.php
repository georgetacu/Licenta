<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');
include 'db.php';

$data = json_decode(file_get_contents("php://input"));
$user_id = $data->user_id ?? null;

if (!$user_id) {
  echo json_encode([]);
  exit;
}

$sql = "
  SELECT 
    a.id,
    a.appointment_datetime,
    a.status,
    s.title AS service_name,
    asv.name AS auto_service_name
  FROM appointments a
  JOIN services s ON a.service_id = s.id
  JOIN auto_services asv ON a.auto_service_id = asv.id
  WHERE a.user_id = ?
  ORDER BY a.appointment_datetime DESC
";

$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$appointments = [];

while ($row = $result->fetch_assoc()) {
  $appointments[] = $row;
}

echo json_encode($appointments);
?>
