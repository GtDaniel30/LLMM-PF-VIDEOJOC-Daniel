<?php
require "db.php";

$id = isset($_GET['id']) ? (int) $_GET['id'] : 0;

if ($id <= 0) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid game id"]);
    exit;
}

$stmt = $conn->prepare("
    SELECT
        g.*,
        u1.username AS player1_username,
        u2.username AS player2_username
    FROM games g
    LEFT JOIN users u1 ON u1.id = g.player1
    LEFT JOIN users u2 ON u2.id = g.player2
    WHERE g.id = ?
");
$stmt->bind_param("i", $id);
$stmt->execute();

$game = $stmt->get_result()->fetch_assoc();

if (!$game) {
    http_response_code(404);
    echo json_encode(["error" => "Game not found"]);
    exit;
}

$game['me'] = $_SESSION['user_id'] ?? null;

echo json_encode($game);
