<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$id = $data->appointment_id;
$newDatetime = $data->new_datetime;

$stmt = $conn->prepare("UPDATE appointments SET appointment_datetime = ?, status = 1 WHERE id = ?");
$stmt->bind_param("si", $newDatetime, $id);
$stmt->execute();

echo json_encode(["success" => true]);
