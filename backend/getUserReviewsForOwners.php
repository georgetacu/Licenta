<?php
header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

include 'db.php';

$sql = "
    SELECT
        ar.id,
        concat(u.first_name, ' ', u.last_name) AS user_name,
        s.title AS service_title,
        ar.comment AS review_text,
        ar.rating,
        ar.created_at,
        asv.name AS auto_service_name
    FROM appointment_reviews ar
    JOIN users u ON ar.user_id = u.id
    JOIN appointments a ON a.id = ar.appointment_id
    JOIN auto_services asv ON a.auto_service_id = asv.id
    JOIN services s ON s.id = a.service_id
";

$result = $conn->query($sql);

$reviews = [];

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $reviews[] = $row;
    }
}

echo json_encode($reviews);
