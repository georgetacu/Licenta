<?php

header("Access-Control-Allow-Origin: *"); // or your frontend's exact origin
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: POST");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include 'db.php';
$data = json_decode(file_get_contents("php://input"));
$id = $data->id ?? null;

if (!$id) {
    echo json_encode(["error" => "Missing service ID"]);
    exit;
}

$title = $data->title;
$description = $data->description;
$price = $data->price;
$duration = $data->duration_minutes;

$stmt = $conn->prepare("UPDATE services SET title=?, description=?, price=?, duration_minutes=? WHERE id=?");
$stmt->bind_param("ssdii", $title, $description, $price, $duration, $id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
