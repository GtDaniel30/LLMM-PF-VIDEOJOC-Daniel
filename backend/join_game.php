<?php
require "db.php";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$gameId = isset($data['game_id']) ? (int) $data['game_id'] : 0;
$userId = (int) $_SESSION['user_id'];

if ($gameId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid game id"]);
    exit;
}

$checkStmt = $conn->prepare("SELECT player1, player2 FROM games WHERE id = ?");
$checkStmt->bind_param("i", $gameId);
$checkStmt->execute();
$game = $checkStmt->get_result()->fetch_assoc();

if (!$game) {
    http_response_code(404);
    echo json_encode(["error" => "Game not found"]);
    exit;
}

if ((int) $game['player1'] === $userId) {
    http_response_code(400);
    echo json_encode(["error" => "No puedes unirte a tu propia partida con el mismo usuario"]);
    exit;
}

$stmt = $conn->prepare("UPDATE games SET player2 = ? WHERE id = ? AND player2 IS NULL");
$stmt->bind_param("ii", $userId, $gameId);
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(409);
    echo json_encode(["error" => "La partida ya esta ocupada"]);
    exit;
}

echo json_encode(["status" => "joined"]);
