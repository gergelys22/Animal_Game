<?php
session_start();

//Database connection
$servername = "mysql.caesar.elte.hu"; // MySQL server route
$username = "gergelys"; // MySQL username
$password = "no9nAFoaDb59yNWN"; // MySQL password
$dbname = "gergelys"; // Database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Registration process
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = $_POST['name'];
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];

    // Check unique username and email
    $check_query = "SELECT * FROM users WHERE username=? OR email=?";
    $check_stmt = $conn->prepare($check_query);
    $check_stmt->bind_param("ss", $username, $email);
    $check_stmt->execute();
    $check_result = $check_stmt->get_result();

    if ($check_result->num_rows > 0) {
        // If username or email already exists
        echo "Username or email already exists.";
    } else {
        // Jelszó hashelése
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        // If every data is OK, inert into the table
        $sql = "INSERT INTO users (name, username, email, password) VALUES (?, ?, ?, ?)";
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("ssss", $name, $username, $email, $hashed_password);
        
        if ($stmt->execute()) {
            // Successful registration
            echo "Registration successful!";
            // Redirect to target website
        } else {
            echo "Error: " . $sql . "<br>" . $conn->error;
        }
    }
}

$conn->close();
?>
