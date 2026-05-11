<?php

session_start();

require "config.php";

$data = json_decode(file_get_contents("php://input"), true );

$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if ($username === '' || $password === '') {
  echo json_encode(["success" => false, "message" => "Usuario y contraseña obligatorios"]);
  exit;
}

try {
  // Abre la conexión con MySQL.
  $connection = getDbConnection();
  // Escapa el usuario antes de construir la consulta SQL.
  $safeUsername = $connection->real_escape_string($username);
  // Busca un único usuario por su nombre.
  $sql = "SELECT username, password FROM users WHERE username = '{$safeUsername}' LIMIT 1";
  $result = $connection->query($sql);
  // Si hay resultado, lo convierte en array; si no, queda en null.
  $user = $result ? $result->fetch_assoc() : null;

  //user : ["usuario", 1234]

  // Si existe y la contraseña coincide, el usuario queda autenticado en la sesión.
  // En producción sería mejor usar password_verify() y no texto plano.
  if ($user && $password === $user['password']) {
    $_SESSION['user'] = $user['username'];
    echo json_encode(["success" => true]);
  } else {
    // Si falla, se devuelve un mensaje para que JS lo muestre en pantalla.
    echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
  }

  // Cierra la conexión cuando termina la consulta.
  $connection->close();
} catch (Throwable $e) {
  // Si hay un problema de conexión o consulta, se responde en JSON.
  echo json_encode(["success" => false, "message" => "Error de conexiÃ³n con la base de datos"]);
}
