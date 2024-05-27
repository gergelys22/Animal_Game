<?php
// save_scores.php
session_start();
include 'db.php';

if (isset($_SESSION['user_id']) && $_SERVER["REQUEST_METHOD"] == "POST") {
    $user_id = $_SESSION['user_id'];
    $username = $_SESSION['username'];
    $score = $_POST['score'];

    $stmt = $conn->prepare("INSERT INTO scoreboard (user_id, username, score) VALUES (?, ?, ?)");
    $stmt->bind_param("isi", $user_id, $username, $score);

    if ($stmt->execute()) {
        echo "Score saved successfully!";
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
    $conn->close();
} else {
    echo "You must be logged in to save a score.";
}
?>
