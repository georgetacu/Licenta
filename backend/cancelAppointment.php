<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");
header('Content-Type: application/json');

include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$id = $data->appointment_id;

$stmt = $conn->prepare("UPDATE appointments SET status = 0 WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

echo json_encode(["success" => true]);
