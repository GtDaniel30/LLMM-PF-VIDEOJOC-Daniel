<?php
require "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($_SESSION['user_id'])) {
    http_response_code(401);
    echo json_encode(["error" => "Not logged in"]);
    exit;
}

$gameId = isset($data['game_id']) ? (int) $data['game_id'] : 0;
$pos = isset($data['pos']) ? (int) $data['pos'] : -1;

if ($gameId <= 0 || $pos < 0 || $pos > 8) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid move"]);
    exit;
}

$stmt = $conn->prepare("SELECT * FROM games WHERE id = ?");
$stmt->bind_param("i", $gameId);
$stmt->execute();
$game = $stmt->get_result()->fetch_assoc();

if (!$game) {
    http_response_code(404);
    echo json_encode(["error" => "Game not found"]);
    exit;
}

if ($game['winner']) {
    http_response_code(409);
    echo json_encode(["error" => "Game finished"]);
    exit;
}

if ((int) $_SESSION['user_id'] !== (int) $game['turn']) {
    http_response_code(403);
    echo json_encode(["error" => "Not your turn"]);
    exit;
}

$board = str_split($game['board']);

if ($board[$pos] !== '-') {
    http_response_code(409);
    echo json_encode(["error" => "Cell occupied"]);
    exit;
}

$isPlayer1 = (int) $_SESSION['user_id'] === (int) $game['player1'];
$symbol = $isPlayer1 ? 'X' : 'O';
$board[$pos] = $symbol;

$newBoard = implode("", $board);
$nextTurn = $isPlayer1 ? $game['player2'] : $game['player1'];
$winner = null;

$lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

foreach ($lines as $line) {
    [$a, $b, $c] = $line;
    if ($board[$a] !== '-' && $board[$a] === $board[$b] && $board[$b] === $board[$c]) {
        $winner = (int) $_SESSION['user_id'];
        $nextTurn = null;
        break;
    }
}

if ($winner === null && !in_array('-', $board, true)) {
    $updateStmt = $conn->prepare("UPDATE games SET board = ?, turn = NULL, winner = 0 WHERE id = ?");
    $updateStmt->bind_param("si", $newBoard, $gameId);
    $updateStmt->execute();
    echo json_encode(["status" => "draw"]);
    exit;
}

if ($winner !== null) {
    $updateStmt = $conn->prepare("UPDATE games SET board = ?, turn = NULL, winner = ? WHERE id = ?");
    $updateStmt->bind_param("sii", $newBoard, $winner, $gameId);
    $updateStmt->execute();
} else {
    $updateStmt = $conn->prepare("UPDATE games SET board = ?, turn = ?, winner = NULL WHERE id = ?");
    $updateStmt->bind_param("sii", $newBoard, $nextTurn, $gameId);
    $updateStmt->execute();
}

echo json_encode(["status" => "ok"]);
