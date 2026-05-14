const celdas = document.querySelectorAll(".celda");
const statusText = document.querySelector("#statusText");
const leaveGameBtn = document.querySelector("#leaveGameBtn");
const createGameBtn = document.querySelector("#createGameBtn");
const joinGameBtn = document.querySelector("#joinGameBtn");
const joinGameInput = document.querySelector("#joinGameInput");
const matchInfo = document.querySelector("#matchInfo");
const juego = document.querySelector("#Juego");

const STORAGE_KEY = "tictactoe-game-id";
let currentGameId = sessionStorage.getItem(STORAGE_KEY) || "";
let pollIntervalId = null;
let currentGameState = null;

const winConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

init();

function init() {
    celdas.forEach((cell) => cell.addEventListener("click", onCellClick));
    leaveGameBtn.addEventListener("click", leaveGame);
    createGameBtn.addEventListener("click", createGame);
    joinGameBtn.addEventListener("click", joinGame);

    if (currentGameId) {
        joinGameInput.value = currentGameId;
        refreshGameState();
        startPolling();
    } else {
        renderLobbyState();
    }
}

function startPolling() {
    stopPolling();
    pollIntervalId = window.setInterval(refreshGameState, 1200);
}

function stopPolling() {
    if (pollIntervalId) {
        clearInterval(pollIntervalId);
        pollIntervalId = null;
    }
}

function setCurrentGameId(gameId) {
    currentGameId = String(gameId);
    sessionStorage.setItem(STORAGE_KEY, currentGameId);
    joinGameInput.value = currentGameId;
}

function clearCurrentGame() {
    currentGameId = "";
    currentGameState = null;
    sessionStorage.removeItem(STORAGE_KEY);
    joinGameInput.value = "";
}

function renderLobbyState() {
    clearBoard();
    juego.classList.add("board-disabled");
    leaveGameBtn.hidden = true;
    statusText.textContent = "Crea o unete a una partida";
    matchInfo.textContent = "";
}

function clearBoard() {
    celdas.forEach((cell) => {
        cell.textContent = "";
        cell.classList.remove("win");
    });
}

function renderBoard(board) {
    const cells = board.split("");

    celdas.forEach((cell, index) => {
        cell.textContent = cells[index] === "-" ? "" : cells[index];
        cell.classList.remove("win");
    });

    for (const condition of winConditions) {
        const [a, b, c] = condition;
        const first = cells[a];
        if (first !== "-" && first === cells[b] && first === cells[c]) {
            celdas[a].classList.add("win");
            celdas[b].classList.add("win");
            celdas[c].classList.add("win");
            break;
        }
    }
}

function isBoardPlayable(game) {
    if (!game || !game.player2 || game.winner) {
        return false;
    }

    return Number(game.turn) === Number(game.me);
}

function updateUiState(game) {
    leaveGameBtn.hidden = false;
    juego.classList.toggle("board-disabled", !isBoardPlayable(game));
}

function getTurnUsername(game) {
    if (Number(game.turn) === Number(game.player1)) {
        return game.player1_username || "Jugador 1";
    }

    if (Number(game.turn) === Number(game.player2)) {
        return game.player2_username || "Jugador 2";
    }

    return "Jugador";
}

async function createGame() {
    try {
        const response = await fetch(window.APP_PATHS.url("backend/create_game.php"));
        const data = await response.json();

        if (!data.game_id) {
            statusText.textContent = data.error || "No se pudo crear la partida";
            matchInfo.textContent = data.error || "";
            return;
        }

        setCurrentGameId(data.game_id);
        matchInfo.textContent = `ID de partida: ${data.game_id}`;
        statusText.textContent = "Partida creada. Esperando al jugador 2";
        leaveGameBtn.hidden = false;
        juego.classList.add("board-disabled");
        startPolling();
        await refreshGameState();
    } catch (error) {
        statusText.textContent = "Error al crear la partida";
    }
}

async function joinGame() {
    const gameId = Number(joinGameInput.value.trim());

    if (!gameId) {
        statusText.textContent = "Escribe un ID de partida";
        return;
    }

    try {
        const response = await fetch(window.APP_PATHS.url("backend/join_game.php"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_id: gameId })
        });
        const data = await response.json();

        if (data.error) {
            statusText.textContent = data.error;
            return;
        }

        setCurrentGameId(gameId);
        startPolling();
        await refreshGameState();
    } catch (error) {
        statusText.textContent = "Error al unirse";
    }
}

async function refreshGameState() {
    if (!currentGameId) {
        return;
    }

    try {
        const url = new URL(window.APP_PATHS.url("backend/game_state.php"), window.location.origin);
        url.searchParams.set("id", currentGameId);

        const response = await fetch(url);
        const game = await response.json();

        if (game.error) {
            if (game.error === "Game not found") {
                stopPolling();
                clearCurrentGame();
                renderLobbyState();
                statusText.textContent = "La partida ya no existe";
                matchInfo.textContent = "El otro jugador ha salido de la partida.";
                return;
            }

            statusText.textContent = game.error;
            return;
        }

        currentGameState = game;
        renderBoard(game.board);
        matchInfo.textContent = `ID de partida: ${game.id} | ${game.player1_username || "Jugador 1"} vs ${game.player2_username || "Esperando jugador 2"}`;
        updateUiState(game);

        if (game.winner !== null && Number(game.winner) === 0) {
            statusText.textContent = "Empate";
            return;
        }

        if (game.winner) {
            const winnerName = Number(game.winner) === Number(game.player1)
                ? (game.player1_username || "Jugador 1")
                : (game.player2_username || "Jugador 2");
            statusText.textContent = `Ha ganado ${winnerName}`;
            return;
        }

        if (!game.player2) {
            statusText.textContent = "Esperando al jugador 2";
            return;
        }

        const turnUsername = getTurnUsername(game);
        statusText.textContent = `Turno de ${turnUsername}`;
    } catch (error) {
        statusText.textContent = "Error al actualizar";
    }
}

async function onCellClick(event) {
    if (!currentGameId) {
        statusText.textContent = "Primero crea o unete a una partida";
        return;
    }

    if (!currentGameState?.player2) {
        statusText.textContent = "El tablero se desbloquea cuando se una el jugador 2";
        return;
    }

    if (Number(currentGameState.turn) !== Number(currentGameState.me)) {
        statusText.textContent = "Todavia no es tu turno";
        return;
    }

    if (currentGameState.winner) {
        return;
    }

    const pos = Number(event.currentTarget.getAttribute("cellIndex"));

    try {
        const response = await fetch(window.APP_PATHS.url("backend/move.php"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_id: Number(currentGameId), pos })
        });
        const data = await response.json();

        if (data.error) {
            statusText.textContent = data.error;
            return;
        }

        await refreshGameState();
    } catch (error) {
        statusText.textContent = "Error al mover";
    }
}

async function leaveGame() {
    if (!currentGameId) {
        renderLobbyState();
        return;
    }

    try {
        const response = await fetch(window.APP_PATHS.url("backend/leave_game.php"), {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ game_id: Number(currentGameId) })
        });
        const data = await response.json();

        if (data.error) {
            if (data.error === "Game not found") {
                stopPolling();
                clearCurrentGame();
                renderLobbyState();
                statusText.textContent = "Ya no estabas en una partida activa";
                return;
            }

            statusText.textContent = data.error;
            return;
        }

        stopPolling();
        clearCurrentGame();
        renderLobbyState();
    } catch (error) {
        statusText.textContent = "Error al salir de la partida";
    }
}
