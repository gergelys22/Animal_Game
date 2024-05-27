<?php
// get_scores.php
include 'db.php';

$sql = "SELECT username, score, timestamp FROM scoreboard ORDER BY score DESC";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    echo "<div id='scoreboard'>";
    echo "<table id='scoreboardtable'>";
    echo "<thead><tr><th>Username</th><th>Score</th><th>Timestamp</th></tr></thead>";
    echo "<tbody>";
    while($row = $result->fetch_assoc()) {
        echo "<tr><td>" . htmlspecialchars($row["username"]) . "</td><td>" . htmlspecialchars($row["score"]) . "</td><td>" . htmlspecialchars($row["timestamp"]) . "</td></tr>";
    }
    echo "</tbody></table></div>";
} else {
    echo "<p>0 results</p>";
}
$conn->close();
?>
