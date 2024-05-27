<?php
session_start();

$servername = "mysql.caesar.elte.hu"; // MySQL server route
$username = "gergelys"; // MySQL username
$password = "no9nAFoaDb59yNWN"; // MySQL password
$dbname = "gergelys"; // Database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Check login
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $username = $conn->real_escape_string($_POST['login_username']);
    $password = $_POST['login_password'];

    $sql = "SELECT * FROM users WHERE username=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param("s", $username);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows == 1) {
        $row = $result->fetch_assoc();
        if (password_verify($password, $row['password'])) {
            // Successful login
            $_SESSION['user_id'] = $row['id'];
            $_SESSION['username'] = $row['username'];
            echo "OK"; // Sikeres bejelentkezés jelzése
        } else {
            // Unsuccessful login
            echo "Incorrect username or password!";
        }
    } else {
        // Unsuccessful login
        echo "Incorrect username or password!";
    }

    $stmt->close();
}

$conn->close();
?>
