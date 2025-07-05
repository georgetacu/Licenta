<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Handle preflight request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

require_once 'db.php';

$data = json_decode(file_get_contents("php://input"), true);
$first_name = $data['first_name'] ?? '';
$last_name = $data['last_name'] ?? '';
$email = $data['email'] ?? '';
$password = $data['password'] ?? '';
$serviceId = $data['service_id'] ?? 0;

if (!$first_name || !$last_name || !$email || !$password || !$serviceId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing fields"]);
    exit;
}

// Check if email exists
$check = $conn->prepare("SELECT id FROM users WHERE email = ?");
$check->bind_param("s", $email);
$check->execute();
$check->store_result();

if ($check->num_rows > 0) {
    echo json_encode(["error" => "Email already exists"]);
    exit;
}

// Insert user
$hashedPassword = password_hash($password, PASSWORD_DEFAULT);
$stmt = $conn->prepare("INSERT INTO users (first_name, last_name, email, password, type) VALUES (?, ?, ?, ?, 4)");
$stmt->bind_param("ssss", $first_name, $last_name, $email, $hashedPassword);
if ($stmt->execute()) {
    $newUserId = $stmt->insert_id;

    // Assign user to service
    $update = $conn->prepare("UPDATE auto_services SET assigned_user = ? WHERE id = ?");
    $update->bind_param("ii", $newUserId, $serviceId);
    $update->execute();

    echo json_encode(["success" => true, "user_id" => $newUserId]);
} else {
    echo json_encode(["error" => "Failed to create user"]);
}
