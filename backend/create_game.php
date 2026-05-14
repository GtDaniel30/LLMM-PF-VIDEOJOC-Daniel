<?php
require "db.php";

if (!isset($_SESSION['user_id']) && isset($_SESSION['user'])) {
    $username = $_SESSION['user'];
    $userStmt = $conn->prepare("SELECT id FROM users WHERE username = ? LIMIT 1");
    $userStmt->bind_param("s", $username);
    $userStmt->execute();
    $userResult = $userStmt->get_result()->fetch_assoc();

    if ($userResult) {
        $_SESSION['user_id'] = (int) $userResult['id'];
    }
}

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Debes iniciar sesion otra vez"]);
    exit;
}

$uid = (int) $_SESSION['user_id'];
$stmt = $conn->prepare("INSERT INTO games (player1, turn) VALUES (?, ?)");

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Error preparando la partida: " . $conn->error]);
    exit;
}

$stmt->bind_param("ii", $uid, $uid);

if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Error creando la partida: " . $stmt->error]);
    exit;
}

echo json_encode(["game_id" => (int) $stmt->insert_id]);
