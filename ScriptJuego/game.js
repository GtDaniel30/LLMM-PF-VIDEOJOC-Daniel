
let celdas = document.querySelectorAll(".celda")
const statusText = document.querySelector("#statusText")
const reiniciar = document.querySelector("#restartBtn")

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

let options = ["", "", "", "", "", "", "", "", "",];
let currentPlayer = "X"
let running = false;

iniciarJuego();


function iniciarJuego() {
    celdas.forEach(cell => cell.addEventListener("click", cellclicked));
    reiniciar.addEventListener("click", restartGame);
    statusText.textContent = `${currentPlayer}'s Turn`
    running = true;
}

function cellclicked() {
    const cellIndex = this.getAttribute("cellIndex");

    if (options[cellIndex] !="" || !running) {
        return;
    }

    actualizarcelda(this, cellIndex);
    CheckWinner();
}

function actualizarcelda(celda, index) {
    options[index] = currentPlayer;
    celda.textContent = currentPlayer;
}

function cambiarJugador() {
    currentPlayer = (currentPlayer == "X") ? "O" : "X";
    statusText.textContent = `${currentPlayer}'s Turn`
}

function CheckWinner() {
    let roundWon = false;
    let winningCells = [];

    for (let i = 0; i < winConditions.length; i++) {
        const condition  = winConditions[i];
        const celdaA = options[condition[0]];
        const celdaB = options[condition[1]];
        const celdaC = options[condition[2]];

        if (celdaA == "" || celdaB == "" || celdaC == "") {
            continue;
        }
        if (celdaA == celdaB && celdaB == celdaC) {
            roundWon = true;
            winningCells = condition;
            break;
        }
    }

    if (roundWon) {
        statusText.textContent = `${currentPlayer} wins!`

        winningCells.forEach(index => {
            celdas[index].classList.add("win");
        });

        running = false;
    }
    else if (!options.includes("")){
        statusText.textContent = `Draw!`
        running = false;
    }
    else{
        cambiarJugador();
    }
}

function restartGame() {
    currentPlayer = "X";
    options = ["", "", "", "", "", "", "", "", "",]
    statusText.textContent = `${currentPlayer}'s Turn`;
    celdas.forEach(cell => cell.textContent = "");
    celdas.forEach(cell => {
        cell.classList.remove("win");
    });
    running = true;
}
