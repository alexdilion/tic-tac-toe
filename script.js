const DISPLAY = document.querySelector("#board");
const BUTTONS = DISPLAY.querySelectorAll(".board-button");

// Game board module
const gameBoard = (() => {
    let boardArray = ["", "", "", "", "", "", "", "", ""];

    const setTile = (position, playerNumber) => {
        boardArray[position] = playerNumber.toString();
    };

    const getBoard = () => boardArray;

    const clear = () => {
        boardArray = ["", "", "", "", "", "", "", "", ""];
    };

    return {
        setTile,
        clear,
        getBoard,
    };
})();

// Display module
const displayController = ((display) => {
    const updateDisplay = () => {
        const boardArray = gameBoard.getBoard();
        const p1Mark = gameController.getPlayers().player1.getMark();
        const p2Mark = gameController.getPlayers().player2.getMark();

        boardArray.forEach((tile, position) => {
            const htmlMark = display.querySelector(`button[data-position="${position}"] > span`);

            if (tile === "") {
                htmlMark.classList.add("transparent");
            } else if (tile === "1") {
                htmlMark.textContent = p1Mark;
                htmlMark.classList.remove("player2", "transparent");
                htmlMark.classList.add("player1");
            } else if (tile === "2") {
                htmlMark.textContent = p2Mark;
                htmlMark.classList.remove("player1", "transparent");
                htmlMark.classList.add("player2");
            }
        });
    };

    const clearDisplay = () => {
        gameBoard.clear();
        updateDisplay();
    }

    return {
        updateDisplay,
        clearDisplay,
    };
})(DISPLAY);

// Player factory
const Player = (playerNumber, playerName, playerMark) => {
    let name = playerName;
    let mark = playerMark;
    let wins = 0;
    const number = playerNumber;

    const placeMark = (position) => {
        gameBoard.setTile(position, number);
    };

    const getName = () => name;
    const getMark = () => mark;
    const getWins = () => wins;
    const getNumber = () => number;

    const setName = (newName) => {
        name = newName;
    };

    const setMark = (newMark) => {
        mark = newMark;
    };

    const addWin = () => {
        wins += 1;
    };

    return {
        placeMark,
        getName,
        getMark,
        getWins,
        getNumber,
        setName,
        setMark,
        addWin,
    };
};

// Game controller module
// Game loop and logic occurs here
const gameController = (() => {
    const player1 = Player(1, "Player 1", "close");
    const player2 = Player(2, "Player 2", "circle");

    let currentPlayer = player1;

    const changePlayer = () => {
        currentPlayer = currentPlayer === player1 ? (currentPlayer = player2) : (currentPlayer = player1);
    };

    const isValidMove = (position) => {
        const board = gameBoard.getBoard();

        return board[position] === "";
    }

    const playTurn = (position) => {
        if (!isValidMove(position)) {
            return;
        }

        currentPlayer.placeMark(position);
        displayController.updateDisplay();
        changePlayer();
    };

    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => ({player1, player2});

    return {
        getCurrentPlayer,
        getPlayers,
        playTurn,
    };
})();

BUTTONS.forEach((button) => {
    button.addEventListener("click", (e) => {
        const pos = +e.target.closest("button").getAttribute("data-position");
        gameController.playTurn(pos);
    });
});
