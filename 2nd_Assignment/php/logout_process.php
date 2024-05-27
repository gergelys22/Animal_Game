<?php
// Indítsuk újra a munkamenetet
session_start();

// Töröljük a felhasználó munkamenetét
session_destroy();

// Visszajelzés küldése a kliensnek
echo "Logout successful!";

//header("Location: http://localhost/2nd_Assignment/html/index.html")

?>
