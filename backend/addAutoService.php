<?php
header("Access-Control-Allow-Origin: http://localhost:5173");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Credentials: true");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include __DIR__ . '/db.php';

$data = json_decode(file_get_contents('php://input'), true);

$name = $data['name'] ?? '';
$vat = $data['vat'] ?? '';
$company_name = $data['company_name'] ?? '';
$county = $data['county'] ?? '';
$town = $data['town'] ?? '';
$street = $data['street'] ?? '';
$number = $data['number'] ?? '';
$user_id = $data['user_id'] ?? null;

if (!$user_id || !$name || !$vat) {
    http_response_code(400);
    echo json_encode(['message' => 'Missing required fields.']);
    exit();
}

$stmt = $conn->prepare("INSERT INTO auto_services (name, VAT, company_name, county, town, street, number, user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
$stmt->bind_param("sssssssi", $name, $vat, $company_name, $county, $town, $street, $number, $user_id);

if ($stmt->execute()) {
    echo json_encode(['message' => 'Auto service added successfully']);
} else {
    http_response_code(500);
    echo json_encode(['message' => 'Failed to add auto service']);
}
?>
