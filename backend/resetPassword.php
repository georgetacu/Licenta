<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Content-Type: application/json");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(204);
    exit;
}

include 'db.php'; // asigură-te că ai conexiunea $conn

$data = json_decode(file_get_contents("php://input"), true);

if (
    !isset($data['email']) ||
    !isset($data['currentPassword']) ||
    !isset($data['newPassword'])
) {
    echo json_encode(['success' => false, 'error' => 'Campuri lipsa.']);
    exit;
}

$email = $data['email'];
$currentPassword = $data['currentPassword'];
$newPassword = $data['newPassword'];

// 1. Verificare daca utilizatorul exista
$stmt = $conn->prepare("SELECT id, password FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    echo json_encode(['success' => false, 'error' => 'Utilizator inexistent.']);
    exit;
}

$user = $result->fetch_assoc();

// 2. Verificare parola curenta
if (!password_verify($currentPassword, $user['password'])) {
    echo json_encode(['success' => false, 'error' => 'Parola curenta este gresita.']);
    exit;
}

// 3. Schimbare parola
$newHashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);

$updateStmt = $conn->prepare("UPDATE users SET password = ? WHERE id = ?");
$updateStmt->bind_param("si", $newHashedPassword, $user['id']);

if ($updateStmt->execute()) {
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Eroare la actualizare parola.']);
}
