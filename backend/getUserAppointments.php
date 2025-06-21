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
$user_id = $data['user_id'] ?? null;

if (!$user_id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing user_id"]);
    exit();
}

$stmt = $conn->prepare("
  SELECT a.id, s.name AS service_name, a.appointment_datetime, a.status
  FROM appointments a
  JOIN services s ON a.service_id = s.id
  WHERE a.user_id = ?
  ORDER BY a.appointment_datetime DESC
");
$stmt->bind_param("i", $user_id);

if ($stmt->execute()) {
    $result = $stmt->get_result();
    $appointments = [];

    while ($row = $result->fetch_assoc()) {
        $appointments[] = $row;
    }

    echo json_encode($appointments);
} else {
    http_response_code(500);
    echo json_encode(["error" => "Failed to fetch appointments"]);
}
?>
