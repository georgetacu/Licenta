<?php
session_start();
include("connect.php");

?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Homepage</title>
</head>
<body>  
    <div style="text-align: center; padding:15% ;">
        <p style="font-size: 50px; font-weight: bold;">Welcome to the homepage 
        <?php if(isset($_SESSION['email'])){
            $email= $_SESSION['email'];
            $querry = mysqli_query($conn, "select * from users where email = '$email'");
            while($row = mysqli_fetch_array($querry)){
                echo $row['first_name'].' '.$row['last_name'];
        }
        }  ?>
        :) </p>
        <a href="logout.php">Logout</a>
    </div>
    
</body>
</html>