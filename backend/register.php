<?php
// Carga la conexión a la base de datos.
require "config.php";

// Indica que la respuesta del servidor será JSON.
header("Content-Type: application/json");

// Lee el JSON enviado desde el formulario de registro.
$data = json_decode(file_get_contents("php://input"), true);

// Limpia espacios del usuario y recoge la contraseña.
$username = trim($data['username'] ?? '');
$password = $data['password'] ?? '';

// Validación básica antes de acceder a la base de datos.
if ($username === '' || $password === '') {
  echo json_encode(["success" => false, "message" => "Usuario y contraseÃ±a obligatorios"]);
  exit;
}

try {
  // Abre la conexión con MySQL.
  $connection = getDbConnection();
  // Escapa los datos antes de construir SQL manualmente.
  $safeUsername = $connection->real_escape_string($username);
  $safePassword = $connection->real_escape_string($password);

  // Comprueba si ya existe un usuario con ese nombre.
  $checkSql = "SELECT id FROM users WHERE username = '{$safeUsername}' LIMIT 1";
  $checkResult = $connection->query($checkSql);
  $exists = $checkResult ? $checkResult->fetch_assoc() : null;

  if ($exists) {
    // Si existe, se informa al frontend para que lo muestre al usuario.
    echo json_encode(["success" => false, "message" => "El usuario ya existe"]);
    $connection->close();
    exit;
  }

  // Inserta el nuevo usuario en la tabla.
  // En una versión segura se guardaría la contraseña con password_hash().
  $insertSql = "INSERT INTO users (username, password) VALUES ('{$safeUsername}', '{$safePassword}')";
  if (!$connection->query($insertSql)) {
    throw new RuntimeException("Error en el alta de usuario");
  }

  $connection->close();

  // Si todo sale bien, JS podrá redirigir al login.
  echo json_encode(["success" => true, "message" => "Usuario registrado correctamente"]);
} catch (Throwable $e) {
  // Respuesta genérica si algo falla durante el registro.
  echo json_encode(["success" => false, "message" => "No se pudo registrar el usuario"]);
}
