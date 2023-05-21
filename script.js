const DISPLAY = document.querySelector("#board");
const GAME_CONTAINER = document.querySelector(".game-container");
const FORM = document.querySelector(".game-form");
const BUTTONS = DISPLAY.querySelectorAll(".board-button");
const FORM_TOGGLES = FORM.querySelectorAll(".game-type-button");
const FORM_SUBMIT = FORM.querySelector(".form-submit-button");
const GAME_OVER_CONTAINER = document.querySelector(".game-over-container");
const PLAY_AGAIN = GAME_OVER_CONTAINER.querySelector(".form-submit-button");

const gameBoard = (() => {
    // An empty string represents an empty tile
    // Numbers represent a player
    let boardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];
    let tilesTaken = 0;

    const setTile = (position, playerNumber) => {
        boardArray[position.x][position.y] = playerNumber.toString();
        tilesTaken += 1;
    };

    const getBoard = () => boardArray;

    const clear = () => {
        boardArray = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
        tilesTaken = 0;
    };

    const checkBoard = () => {
        const rows = getBoard();
        const columns = getBoard()[0].map((col, i) => getBoard().map((row) => row[i]));
        const diagonals = [
            [boardArray[0][0], boardArray[1][1], boardArray[2][2]],
            [boardArray[2][0], boardArray[1][1], boardArray[0][2]],
        ];

        const checkLines = (lines) => {
            const result = lines.map((line) => {
                if (line[0] === "") return false;

                return line.every((value) => value === line[0]);
            });

            return result.indexOf(true) !== -1;
        };

        const win = checkLines(rows) || checkLines(columns) || checkLines(diagonals);

        if (win) return "win";
        if (tilesTaken === 9) return "tie";

        return "continue";
    };

    return {
        setTile,
        clear,
        getBoard,
        checkBoard,
    };
})();

const displayController = ((display) => {
    const updateDisplay = () => {
        const boardArray = gameBoard.getBoard();
        const players = gameController.getPlayers();
        const p1Mark = players.player1.getMark();
        const p2Mark = players.player2.getMark();

        // Update each tile according to the board state
        boardArray.forEach((row, rowIndex) => {
            row.forEach((val, valIndex) => {
                const position = `${rowIndex}-${valIndex}`;
                const htmlMark = display.querySelector(`button[data-position="${position}"] > span`);

                if (val === "") {
                    htmlMark.classList.add("transparent");
                } else if (val === "1") {
                    htmlMark.textContent = p1Mark;
                    htmlMark.classList.remove("player2-color", "transparent");
                    htmlMark.classList.add("player1-color");
                } else if (val === "2") {
                    htmlMark.textContent = p2Mark;
                    htmlMark.classList.remove("player1-color", "transparent");
                    htmlMark.classList.add("player2-color");
                }
            });
        });

        // Update player info
        document.querySelector(".player1-info .score").textContent = players.player1.getScore();
        document.querySelector(".player2-info .score").textContent = players.player2.getScore();
        document.querySelector(".player1-info .name").textContent = players.player1.getName();
        document.querySelector(".player2-info .name").textContent = players.player2.getName();
    };

    const hideForm = () => {
        FORM.classList.add("hidden");
        GAME_CONTAINER.classList.remove("hidden");
    };

    const showForm = () => {
        FORM.classList.remove("hidden");
        GAME_CONTAINER.classList.add("hidden");
        GAME_OVER_CONTAINER.classList.add("hidden");
    };

    const showGameOverScreen = () => {
        GAME_OVER_CONTAINER.classList.remove("hidden");
        FORM.classList.add("hidden");
        GAME_CONTAINER.classList.add("hidden");

        const players = gameController.getPlayers();

        GAME_OVER_CONTAINER.querySelector(".winner-name").textContent = gameController.getCurrentPlayer().getName();
        GAME_OVER_CONTAINER.querySelector(".player1-score").textContent = players.player1.getScore();
        GAME_OVER_CONTAINER.querySelector(".player2-score").textContent = players.player2.getScore();
    };

    const hideGameOverScreen = () => {
        GAME_OVER_CONTAINER.classList.add("hidden");
    };

    return {
        updateDisplay,
        hideForm,
        showForm,
        showGameOverScreen,
        hideGameOverScreen,
    };
})(DISPLAY);

const formController = (() => {
    const button1Player = FORM.querySelector("#toggle-1player");
    const button2Player = FORM.querySelector("#toggle-2player");
    const textPlayer1Name = FORM.querySelector("#player1-name");
    const textPlayer2Name = FORM.querySelector("#player2-name");

    const gameTypeToggle = (button) => {
        if (button.getAttribute("data-selected") === "false") {
            if (button === button1Player) {
                button1Player.setAttribute("data-selected", "true");
                FORM.querySelector("#player2-name").disabled = true;
                FORM.querySelector("#player2-name").value = "CPU";
                button2Player.setAttribute("data-selected", "false");
            } else if (button === button2Player) {
                button2Player.setAttribute("data-selected", "true");
                FORM.querySelector("#player2-name").disabled = false;
                FORM.querySelector("#player2-name").value = "Player 2";
                button1Player.setAttribute("data-selected", "false");
            }
        }
    };

    const submitForm = () => {
        const twoPlayerGame = button2Player.getAttribute("data-selected") === "true";

        const isValidName = (playerName) => playerName !== "";

        const player1Name = isValidName(textPlayer1Name.value) ? textPlayer1Name.value : "Player 1";
        const player1 = Player(1, player1Name, "close");

        let player2;

        if (twoPlayerGame) {
            const player2Name = isValidName(textPlayer2Name.value) ? textPlayer2Name.value : "Player 2";
            player2 = Player(2, player2Name, "circle");
        } else {
            // Make an AI object
        }

        gameController.setPlayer1(player1);
        gameController.setPlayer2(player2);

        displayController.hideForm();
        displayController.updateDisplay();
    };

    return {
        gameTypeToggle,
        submitForm,
    };
})();

const Player = (playerNumber, playerName, playerMark) => {
    let name = playerName;
    let mark = playerMark;
    let score = 0;
    const number = playerNumber;

    const placeMark = (position) => {
        gameBoard.setTile(position, number);
    };

    const getName = () => name;
    const getMark = () => mark;
    const getScore = () => score;
    const getNumber = () => number;

    const setName = (newName) => {
        name = newName;
    };

    const setMark = (newMark) => {
        mark = newMark;
    };

    const incrementScore = () => {
        score += 1;
    };

    const resetScore = () => {
        score = 0;
    };

    return {
        placeMark,
        getName,
        getMark,
        getScore,
        getNumber,
        setName,
        setMark,
        incrementScore,
        resetScore,
    };
};

const gameController = (() => {
    let player1;
    let player2;

    let currentPlayer = player1;
    let playing = true;
    let winningScore = 3; // First player to this score wins

    const changePlayer = () => {
        currentPlayer = currentPlayer === player1 ? (currentPlayer = player2) : (currentPlayer = player1);
    };

    const isValidMove = (position) => {
        const board = gameBoard.getBoard();

        return board[position.x][position.y] === "";
    };

    const newRound = () => {
        gameBoard.clear();
        displayController.updateDisplay();
        currentPlayer = player1;
        playing = true;
    };

    const restartGame = () => {
        player1.resetScore();
        player2.resetScore();
        playing = true;

        gameBoard.clear();
        displayController.updateDisplay();
    };

    // Main round logic happens here
    const playTurn = (position) => {
        if (!isValidMove(position)) return;
        if (!playing) return;

        currentPlayer.placeMark(position);
        displayController.updateDisplay();

        const turnResult = gameBoard.checkBoard();

        if (turnResult === "tie" || turnResult === "win") {
            if (turnResult === "win") currentPlayer.incrementScore();

            if (currentPlayer.getScore() === winningScore) {
                playing = false;
                // play win sound and throw confetti
                setTimeout(() => {
                    displayController.showGameOverScreen();
                }, 500);
            } else {
                playing = false;
                setTimeout(newRound, 500);
            }
        } else {
            changePlayer();
        }
    };

    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => ({player1, player2});
    const getState = () => playing;

    const setWinningScore = (newValue) => {
        winningScore = newValue;
    };

    const setPlayer1 = (newValue) => {
        player1 = newValue;
        currentPlayer = player1;
    };

    const setPlayer2 = (newValue) => {
        player2 = newValue;
    };

    return {
        restartGame,
        playTurn,
        getCurrentPlayer,
        getPlayers,
        getState,
        setPlayer1,
        setPlayer2,
    };
})();

BUTTONS.forEach((button) => {
    button.addEventListener("click", (e) => {
        let pos = e.target.closest("button").getAttribute("data-position").split("-");
        pos = {x: pos[0], y: pos[1]};
        if (gameController.getState()) gameController.playTurn(pos);
    });
});

FORM_TOGGLES.forEach((button) => {
    button.addEventListener("click", (e) => {
        if (e.target.closest("button").disabled) return;
        formController.gameTypeToggle(e.target.closest("button"));
    });
});

FORM_SUBMIT.addEventListener("click", (event) => {
    event.preventDefault();
    formController.submitForm();
});

PLAY_AGAIN.addEventListener("click", () => {
    displayController.showForm();
    gameController.restartGame();
});
