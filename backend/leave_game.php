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
    echo json_encode(["status" => "left"]);
    exit;
}

$me = (int) $_SESSION['user_id'];

if ($me === (int) $game['player1']) {
    $deleteStmt = $conn->prepare("DELETE FROM games WHERE id = ?");
    $deleteStmt->bind_param("i", $gameId);
    $deleteStmt->execute();
    echo json_encode(["status" => "left"]);
    exit;
}

if ($me === (int) $game['player2']) {
    $board = "---------";
    $winner = null;
    $player2 = null;
    $turn = (int) $game['player1'];

    $updateStmt = $conn->prepare("UPDATE games SET player2 = ?, board = ?, turn = ?, winner = ? WHERE id = ?");
    $updateStmt->bind_param("isiii", $player2, $board, $turn, $winner, $gameId);
    $updateStmt->execute();
    echo json_encode(["status" => "left"]);
    exit;
}

http_response_code(403);
echo json_encode(["error" => "You are not in this game"]);
