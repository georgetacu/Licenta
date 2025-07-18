<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['appointment_id'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing appointment_id']);
    exit;
}

$appointment_id = (int)$data['appointment_id'];

$query = "
    SELECT u.email, u.first_name || ' ' || u.last_name AS name
    FROM appointments a 
    JOIN users u ON a.user_id = u.id 
    WHERE a.id = ?
";
$stmt = $conn->prepare($query);
$stmt->bind_param("i", $appointment_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    http_response_code(404);
    echo json_encode(['error' => 'Appointment not found']);
    exit;
}

$user = $result->fetch_assoc();
$email = $user['email'];
$name = $user['name'];
$stmt->close();

$update = $conn->prepare("UPDATE appointments SET status = 3 WHERE id = ?");
$update->bind_param("i", $appointment_id);

if (!$update->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to finalize appointment']);
    exit;
}
$update->close();

echo json_encode(['success' => true]);
exit;
