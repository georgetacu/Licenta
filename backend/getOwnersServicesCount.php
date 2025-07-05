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

$query = "
  SELECT u.id, u.first_name, u.last_name, COUNT(s.id) as service_count
  FROM users u
  LEFT JOIN auto_services s ON u.id = s.user_id
  WHERE u.type = 2
  GROUP BY u.id, u.first_name, u.last_name
";

$result = $conn->query($query);
$ownersServices = [];

while ($row = $result->fetch_assoc()) {
    $ownersServices[] = $row;
}

echo json_encode(['ownersServices' => $ownersServices]);

$conn->close();
