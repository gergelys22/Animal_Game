<?php
// db.php
$servername = "mysql.caesar.elte.hu"; // MySQL server route
$username = "gergelys"; // MySQL username
$password = "no9nAFoaDb59yNWN"; // MySQL password
$dbname = "gergelys"; // Database name

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}
?>
