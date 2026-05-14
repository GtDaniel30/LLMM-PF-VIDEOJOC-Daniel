<?php
session_start();

if (isset($_SESSION['user']) && !isset($_SESSION['user_id'])) {
  $connection = @new mysqli("127.0.0.1", "root", "", "tictactoe");

  if (!$connection->connect_error) {
    $connection->set_charset("utf8mb4");
    $statement = $connection->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");

    if ($statement) {
      $statement->bind_param("s", $_SESSION['user']);
      $statement->execute();
      $result = $statement->get_result()->fetch_assoc();

      if ($result) {
        $_SESSION['user_id'] = (int) $result['id'];
      }
    }
  }
}

if (isset($_SESSION['user'])) {
  echo json_encode([
    "logged" => true,
    "user" => $_SESSION['user'],
    "user_id" => $_SESSION['user_id'] ?? null
  ]);
} else {
  echo json_encode(["logged" => false]);
}
