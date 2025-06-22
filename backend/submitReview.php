<?php
// submitReview.php
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

include 'db.php'; // Use your existing connection


if (!isset($data['appointment_id'], $data['user_id'], $data['rating'])) {
    echo json_encode(['error' => 'Missing required fields']);
    http_response_code(400);
    exit;
}

$appointment_id = (int)$data['appointment_id'];
$user_id = (int)$data['user_id'];
$rating = (int)$data['rating'];
$comment = $data['comment'] ?? '';

if ($rating < 1 || $rating > 5) {
    echo json_encode(['error' => 'Rating must be between 1 and 5']);
    http_response_code(400);
    exit;
}

$stmt = $conn->prepare("INSERT INTO appointment_reviews (appointment_id, user_id, rating, comment) VALUES (?, ?, ?, ?)");
$stmt->bind_param('iiis', $appointment_id, $user_id, $rating, $comment);

if ($stmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to submit review']);
}

$stmt->close();
$conn->close();
