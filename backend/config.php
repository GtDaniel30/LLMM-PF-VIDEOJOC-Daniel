<?php 

function getDbConnection(): mysqli {

    $host = "127.0.0.1";
    $dbName = "tictactoe";
    $dbUser = "root";
    $dbPassword = "";


    $connection = new mysqli($host, $dbUser, $dbPassword, $dbName);

    if ($connection->connect_error) {
    throw new RuntimeException("Error de conexion a la base de datos");
  }

  // Ajusta la codificación para soportar bien caracteres especiales.
  $connection->set_charset("utf8mb4");

  return $connection;
}