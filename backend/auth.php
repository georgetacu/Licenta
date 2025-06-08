<?php


header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');


if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // CORS preflight request
    http_response_code(200);
    exit();
}

// DB connection
$servername = "localhost";
$username = "root";
$password = "";
$dbname = "ExpertAuto";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
  http_response_code(500);
  echo json_encode(["error" => "Database connection failed"]);
  exit();
}
// Read POST body
$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data['action'])) {
  http_response_code(400);
  echo json_encode(["error" => "Missing action"]);
  exit();
}

$action = $data['action'];

if ($action === 'login') {
  $email = $data['email'];
  $password = $data['password'];

  $stmt = $conn->prepare("SELECT * FROM users WHERE email = ?");
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $result = $stmt->get_result();

  if ($result->num_rows == 0) {
    http_response_code(409);
    echo json_encode(["error" => "Account doesn't exist"]);
    exit();
  }
  
  if ($user = $result->fetch_assoc()) {

    $verify = password_verify($password, $user['password']);
    file_put_contents('debug.log', "Verify result: " . ($verify ? "true" : "false") . "\n", FILE_APPEND);

    if ($verify) {
        echo json_encode(["message" => "Login successful", "user" => $user]);
    } else {
        http_response_code(401);
        echo json_encode(["error" => "Invalid password"]);
    }
}


} elseif ($action === 'register') {
  $firstname = $data['firstname'];
  $lastname = $data['lastname'];
  $email = $data['email'];
  $mobile = $data['mobile'];
  $type = $data['type'];
  $password = password_hash($data['password'], PASSWORD_DEFAULT);

  // Check if user exists
  $check = $conn->prepare("SELECT id FROM users WHERE email = ?");
  $check->bind_param("s", $email);
  $check->execute();
  $check->store_result();
  if ($check->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Email already registered"]);
    exit();
  }

  // Insert new user
  $stmt = $conn->prepare("INSERT INTO users (first_name,last_name, email, password,mobile,type,created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())");
  $stmt->bind_param("ssssss", $firstname, $lastname, $email, $password, $mobile, $type);
  if ($stmt->execute()) {
    echo json_encode(["message" => "Registration successful"]);
  } else {
    http_response_code(500);
    echo json_encode(["error" => "Registration failed"]);
  }

} else {
  http_response_code(400);
  echo json_encode(["error" => "Invalid action"]);
}

$conn->close();
?>
