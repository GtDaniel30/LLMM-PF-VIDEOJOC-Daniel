<?php

session_start();

$conn = new mysqli("127.0.0.1", "root", "", "tictactoe");

if ($conn->connect_error) {
    http_response_code(500);
    header("Content-Type: application/json");
    echo json_encode(["error" => "DB error"]);
    exit;
}

$conn->set_charset("utf8mb4");

header("Content-Type: application/json");
