<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Content-Type: application/json");
include 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$id = $data['id'];
$name = $data['name'];
$street = $data['street'];
$number = $data['number'];
$town = $data['town'];
$county = $data['county'];

$stmt = $conn->prepare("UPDATE auto_services SET name=?, street=?, number=?, town=?, county=? WHERE id=?");
$stmt->bind_param("sssssi", $name, $street, $number, $town, $county, $id);
$stmt->execute();

echo json_encode(["success" => true]);
?>
