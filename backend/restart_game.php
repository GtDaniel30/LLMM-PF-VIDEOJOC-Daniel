<?php
require "db.php";

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$data = json_decode(file_get_contents("php://input"), true);
$gameId = isset($data['game_id']) ? (int) $data['game_id'] : 0;

if ($gameId <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid game id"]);
    exit;
}

$stmt = $conn->prepare("SELECT player1, player2 FROM games WHERE id = ?");
$stmt->bind_param("i", $gameId);
$stmt->execute();
$game = $stmt->get_result()->fetch_assoc();

if (!$game) {
    http_response_code(404);
    echo json_encode(["error" => "Game not found"]);
    exit;
}

$me = (int) $_SESSION['user_id'];
if ($me !== (int) $game['player1'] && $me !== (int) $game['player2']) {
    http_response_code(403);
    echo json_encode(["error" => "You are not in this game"]);
    exit;
}

$turn = (int) $game['player1'];
$board = '---------';
$winner = null;

$updateStmt = $conn->prepare("UPDATE games SET board = ?, turn = ?, winner = ? WHERE id = ?");
$updateStmt->bind_param("siii", $board, $turn, $winner, $gameId);
$updateStmt->execute();

echo json_encode(["status" => "ok"]);
