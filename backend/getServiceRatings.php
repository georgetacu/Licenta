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

$sql = "
  SELECT a.auto_service_id, AVG(ar.rating) AS avg_rating
  FROM appointment_reviews ar
  JOIN appointments a ON ar.appointment_id = a.id
  GROUP BY a.auto_service_id
";

$result = $conn->query($sql);
$ratings = [];
while ($row = $result->fetch_assoc()) {
  $ratings[$row['auto_service_id']] = round(floatval($row['avg_rating']), 1);
}

echo json_encode(['ratings' => $ratings]);

$conn->close();
