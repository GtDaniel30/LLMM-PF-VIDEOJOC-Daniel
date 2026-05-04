let celdas5x5 = document.querySelectorAll(".celda5x5")
const statusText5x5 = document.querySelector("#statusText5x5")
const reiniciar5x5 = document.querySelector("#restartBtn5x5")

const winConditions5x5 = [
    [0, 1, 2, 3],
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [6, 7, 8, 9],
    [10, 11, 12, 13],
    [11, 12, 13, 14],
    [15, 16, 17, 18],
    [16, 17, 18, 19],
    [20, 21, 22, 23],
    [21, 22, 23, 24],
    [0, 5, 10, 15],
    [5, 10, 15, 20],
    [1, 6, 11, 16],
    [6, 11, 16, 21],
    [2, 7, 12, 17],
    [7, 12, 17, 22],
    [3, 8, 13, 18],
    [8, 13, 18, 23],
    [4, 9, 14, 19],
    [9, 14, 19, 24],
    [0, 6, 12, 18],
    [6, 12, 18, 24],
    [1, 7, 13, 19],
    [5, 11, 17, 23],
    [15, 11, 7, 3],
    [20, 16, 12, 8],
    [21, 17, 13, 9],
    [16, 12, 8, 4]
];

let options5x5 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",];
let currentPlayer = "X";
let running = false;

iniciarJuego5x5();

function iniciarJuego5x5() {
    celdas5x5.forEach(cell => cell.addEventListener("click", cellclicked5x5));
    reiniciar5x5.addEventListener("click", restartGame5x5);
    statusText5x5.textContent = `${currentPlayer}'s Turn`
    running = true;
}

function cellclicked5x5() {
    const cellIndex5x5 = this.getAttribute("cellIndex5x5");

    if (options5x5[cellIndex5x5] != "" || !running) {
        return;
    }

    actualizarcelda5x5(this, cellIndex5x5);
    CheckWinner5x5();
}

function actualizarcelda5x5(celda, index) {
    options5x5[index] = currentPlayer;
    celda.textContent = currentPlayer;
}

function cambiarJugador5x5() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText5x5.textContent = `${currentPlayer}'s Turn`
}

function CheckWinner5x5() {
    let roundWon = false;
    let winningCells5x5 = [];

    for (let i = 0; i < winConditions5x5.length; i++) {
        const condition = winConditions5x5[i];
        const celdaA = options5x5[condition[0]];
        const celdaB = options5x5[condition[1]];
        const celdaC = options5x5[condition[2]];
        const celdaD = options5x5[condition[3]]

        if (celdaA == "" || celdaB == "" || celdaC == "" || celdaD == "") {
            continue;
        }
        if (celdaA == celdaB && celdaB == celdaC && celdaC == celdaD) {
            roundWon = true;
            winningCells5x5 = condition;
            break;
        }
    }

    if (roundWon) {
        statusText5x5.textContent = `${currentPlayer} wins!`
        winningCells5x5.forEach(index => {
            celdas5x5[index].classList.add("win");
        });
        running = false;
    }
    else if (!options5x5.includes("")) {
        statusText5x5.textContent = `Draw!`
        running = false;
    }
    else {
        cambiarJugador5x5();
    }
}

function restartGame5x5() {
    currentPlayer = "X";
    options5x5 = ["", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "",];
    statusText5x5.textContent = `${currentPlayer}'s Turn`;
    celdas5x5.forEach(cell => cell.textContent = "");
    celdas5x5.forEach(cell => {
        cell.classList.remove("win");
    });
    running = true;
}