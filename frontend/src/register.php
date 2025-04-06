<?php
 include '../../backend/connect.php';

 if(isset($_POST['signUp']))
 {
    $firstName = $_POST['fName'];
    $lastName = $_POST['lName'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password = md5($password);
    $created_at = date('Y-m-d H:i:s');

    $checkEmail = "select * from users where email = '$email'";
    $result = $conn->query($checkEmail);
    if($result->num_rows > 0)
    {
        echo "Email already exists";
    }
    else {
        $insertQuerry = "insert into users (first_name, last_name, email, password, created_at) values ('$firstName','$lastName','$email','$password','$created_at')";
        if($conn->query($insertQuerry) === TRUE)
        {
            header("location : http://localhost:5173/frontend/src/index.php");
            
        }
        else {
            echo "Error: " . $insertQuerry . "<br>" . $conn->error;
        }
    }
 }

 if(isset($_POST['signIn']))
 {
    $email = $_POST['email'];
    $password = $_POST['password'];
    $password = md5($password);
    $checkEmail = "select * from users where email = '$email' and password = '$password'";
    $result = $conn->query($checkEmail);
    if($result->num_rows > 0)
    {
        session_start();
        $row = $result->fetch_assoc();
        $_SESSION['email'] = $row['email'];
        header(" http://localhost:5173");
        exit();
    }
    else {
        echo "Login Failed";
    }
 }


?>