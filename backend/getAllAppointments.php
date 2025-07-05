<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$result = $conn->query("SELECT * FROM appointments ORDER BY created_at DESC");
$appointments = [];

while ($row = $result->fetch_assoc()) {
    $appointments[] = $row;
}

echo json_encode(["appointments" => $appointments]);

$conn->close();
