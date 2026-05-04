let celdas7x7 = document.querySelectorAll(".celda7x7")
const statusText7x7 = document.querySelector("#statusText7x7")
const reiniciar7x7 = document.querySelector("#restartBtn7x7")

const winConditions7x7 = [
    // --- HORIZONTALES (21 combinaciones: 3 por fila x 7 filas) ---
    [0, 1, 2, 3, 4], [1, 2, 3, 4, 5], [2, 3, 4, 5, 6],
    [7, 8, 9, 10, 11], [8, 9, 10, 11, 12], [9, 10, 11, 12, 13],
    [14, 15, 16, 17, 18], [15, 16, 17, 18, 19], [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25], [22, 23, 24, 25, 26], [23, 24, 25, 26, 27],
    [28, 29, 30, 31, 32], [29, 30, 31, 32, 33], [30, 31, 32, 33, 34],
    [35, 36, 37, 38, 39], [36, 37, 38, 39, 40], [37, 38, 39, 40, 41],
    [42, 43, 44, 45, 46], [43, 44, 45, 46, 47], [44, 45, 46, 47, 48],

    // --- VERTICALES (21 combinaciones: 3 por columna x 7 columnas) ---
    [0, 7, 14, 21, 28], [7, 14, 21, 28, 35], [14, 21, 28, 35, 42],
    [1, 8, 15, 22, 29], [8, 15, 22, 29, 36], [15, 22, 29, 36, 43],
    [2, 9, 16, 23, 30], [9, 16, 23, 30, 37], [16, 23, 30, 37, 44],
    [3, 10, 17, 24, 31], [10, 17, 24, 31, 38], [17, 24, 31, 38, 45],
    [4, 11, 18, 25, 32], [11, 18, 25, 32, 39], [18, 25, 32, 39, 46],
    [5, 12, 19, 26, 33], [12, 19, 26, 33, 40], [19, 26, 33, 40, 47],
    [6, 13, 20, 27, 34], [13, 20, 27, 34, 41], [20, 27, 34, 41, 48],

    // --- DIAGONALES HACIA ABAJO-DERECHA (9 combinaciones) ---
    [0, 8, 16, 24, 32], [1, 9, 17, 25, 33], [2, 10, 18, 26, 34],
    [7, 15, 23, 31, 39], [8, 16, 24, 32, 40], [9, 17, 25, 33, 41],
    [14, 22, 30, 38, 46], [15, 23, 31, 39, 47], [16, 24, 32, 40, 48],

    // --- DIAGONALES HACIA ABAJO-IZQUIERDA (9 combinaciones) ---
    [4, 10, 16, 22, 28], [5, 11, 17, 23, 29], [6, 12, 18, 24, 30],
    [11, 17, 23, 29, 35], [12, 18, 24, 30, 36], [13, 19, 25, 31, 37],
    [18, 24, 30, 36, 42], [19, 25, 31, 37, 43], [20, 26, 32, 38, 44]
];

let options7x7 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let running = false;

iniciarJuego7x7();

function iniciarJuego7x7() {
    celdas7x7.forEach(cell => cell.addEventListener("click", cellclicked7x7));
    reiniciar7x7.addEventListener("click", restartGame7x7);
    statusText7x7.textContent = `${currentPlayer}'s Turn`
    running = true;
}

function cellclicked7x7() {
    const cellIndex7x7 = this.getAttribute("cellIndex7x7");

    if (options7x7[cellIndex7x7] != "" || !running) {
        return;
    }

    actualizarcelda7x7(this, cellIndex7x7);
    CheckWinner7x7();
}

function actualizarcelda7x7(celda, index) {
    options7x7[index] = currentPlayer;
    celda.textContent = currentPlayer;
}

function cambiarJugador7x7() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText7x7.textContent = `${currentPlayer}'s Turn`
}

function CheckWinner7x7() {
    let roundWon = false;
    let winningCells7x7 = [];

    for (let i = 0; i < winConditions7x7.length; i++) {
        const condition = winConditions7x7[i];
        const celdaA = options7x7[condition[0]];
        const celdaB = options7x7[condition[1]];
        const celdaC = options7x7[condition[2]];
        const celdaD = options7x7[condition[3]];
        const celdaE = options7x7[condition[4]];

        if (celdaA == "" || celdaB == "" || celdaC == "" || celdaD == "" || celdaE == "") {
            continue;
        }
        if (celdaA == celdaB && celdaB == celdaC && celdaC == celdaD && celdaD ==celdaE) {
            roundWon = true;
            winningCells7x7 = condition;
            break;
        }
    }

    if (roundWon) {
        statusText7x7.textContent = `${currentPlayer} wins!`
        winningCells7x7.forEach(index => {
            celdas7x7[index].classList.add("win");
        });
        running = false;
    }
    else if (!options7x7.includes("")) {
        statusText7x7.textContent = `Draw!`
        running = false;
    }
    else {
        cambiarJugador7x7();
    }
}

function restartGame7x7() {
    currentPlayer = "X";
    let options7x7 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", ""];
    statusText7x7.textContent = `${currentPlayer}'s Turn`;
    celdas7x7.forEach(cell => cell.textContent = "");
    celdas7x7.forEach(cell => {
        cell.classList.remove("win");
    });
    running = true;
}