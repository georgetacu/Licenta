<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php'; // use shared DB connection

// Get pending owners: type = 2 AND status = 2
$result = $conn->query("SELECT * FROM users WHERE type = 2 AND status = 2");
$owners = [];

while ($row = $result->fetch_assoc()) {
    $owners[] = $row;
}

echo json_encode(["owners" => $owners]);

$conn->close();
