<?php

session_start();

$conn = new mysqli(
 "projectedani.infinityfreeapp.com",
 "if0_41931698",
 "mamadeocallao",
 "if0_41931698_tictactoe"
);

if ($conn->connect_error) {
 die("Error: " . $conn->connect_error);
}


header("Content-Type: application/json");

