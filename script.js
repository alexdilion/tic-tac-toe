const DISPLAY = document.querySelector("#board");
const BUTTONS = DISPLAY.querySelectorAll(".board-button");

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
        const players = gameController.getPlayers()
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
        document.querySelector(".player1-info .score").textContent = players.player1.getWins();
        document.querySelector(".player2-info .score").textContent = players.player2.getWins();
        document.querySelector(".player1-info .name").textContent = players.player1.getName();
        document.querySelector(".player2-info .name").textContent = players.player2.getName();
    };

    return {
        updateDisplay,
    };
})(DISPLAY);

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

const gameController = (() => {
    const player1 = Player(1, "Alex", "close");
    const player2 = Player(2, "CPU", "circle");

    let currentPlayer = player1;
    let playing = true;

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

    const playTurn = (position) => {
        if (!isValidMove(position)) return;
        if (!playing) return;

        currentPlayer.placeMark(position);
        displayController.updateDisplay();

        const turnResult = gameBoard.checkBoard();

        if (turnResult === "tie" || turnResult === "win") {
            if (turnResult === "win") currentPlayer.addWin();
            playing = false;
            setTimeout(newRound, 500);
        } else {
            changePlayer();
        }
    };

    const getCurrentPlayer = () => currentPlayer;
    const getPlayers = () => ({player1, player2});

    return {
        getCurrentPlayer,
        getPlayers,
        playTurn,
    };
})();

displayController.updateDisplay();

BUTTONS.forEach((button) => {
    button.addEventListener("click", (e) => {
        let pos = e.target.closest("button").getAttribute("data-position").split("-");
        pos = {x: pos[0], y: pos[1]};
        gameController.playTurn(pos);
    });
});
