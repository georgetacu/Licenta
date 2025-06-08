<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');  // Allow cross-origin requests

// Connect to database
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "users"; // Example database

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
  die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT * FROM users";
$result = $conn->query($sql);

$services = [];
if ($result->num_rows > 0) {
  while($row = $result->fetch_assoc()) {
    $services[] = $row;
  }
}

echo json_encode($services);

$conn->close();
?>
