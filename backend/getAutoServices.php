<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header("Content-Type: application/json");

include __DIR__ . '/db.php';

$result = $conn->query("SELECT * FROM auto_services ORDER BY created_at DESC");

$services = [];

while ($row = $result->fetch_assoc()) {
    $services[] = $row;
}

echo json_encode($services);
