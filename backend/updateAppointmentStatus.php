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

if (!isset($data['appointment_id']) || !isset($data['status'])) {
    http_response_code(400);
    echo json_encode(['error' => 'Missing data']);
    exit;
}

$appointment_id = (int)$data['appointment_id'];
$status = (int)$data['status'];

// Update appointment status
$update = $conn->prepare("UPDATE appointments SET status = ? WHERE id = ?");
$update->bind_param("ii", $status, $appointment_id);

if (!$update->execute()) {
    http_response_code(500);
    echo json_encode(['error' => 'Could not update status']);
    exit;
}
$update->close();

// Send email only when status is 2 (Approved)
if ($status === 2) {
    $query = "
        SELECT u.email, CONCAT(u.first_name, ' ', u.last_name) AS name, s.title AS service, a.appointment_datetime
        FROM appointments a
        JOIN users u ON a.user_id = u.id
        JOIN services s ON a.service_id = s.id
        WHERE a.id = ?
    ";
    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $appointment_id);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result && $result->num_rows > 0) {
        $user = $result->fetch_assoc();
        $email = $user['email'];
        $name = $user['name'];
        $service = $user['service'];
        $datetime = date("d.m.Y H:i", strtotime($user['appointment_datetime']));

        $subject = "Programare Aprobată - ExpertAuto";
        $message = "Bună $name,\n\nProgramarea ta pentru serviciul '$service' pe data de $datetime a fost aprobată.\n\nTe așteptăm la service!\n\nEchipa ExpertAuto";
        $headers = "From: notificari.expertauto@gmail.com";

        // Uncomment to enable real email sending:
        // mail($email, $subject, $message, $headers);
    }
}

echo json_encode(['success' => true]);
exit;
