<?php
// Restart session
session_start();

// Delete user session
session_destroy();

// Feedback to client
echo "Logout successful!";

//header("Location: http://localhost/2nd_Assignment/html/index.html")

?>
