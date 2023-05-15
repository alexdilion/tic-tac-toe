const DISPLAY = document.querySelector("#board");

// Game board module
const gameBoard = (() => {
    let boardArray = ["1", "2", "", "1", "", "1", "2", "", ""];

    const setTile = (index, playerNumber) => {
        boardArray[index] = playerNumber;
    };

    const isValidMove = (index) => boardArray[index] === "";
    const getBoard = () => boardArray;

    const clear = () => {
        boardArray = ["", "", "", "", "", "", "", "", ""];
    };

    return {
        setTile,
        clear,
        isValidMove,
        getBoard,
    };
})();

const displayController = ((display) => {
    const updateDisplay = () => {
        const boardArray = gameBoard.getBoard();
        const p1Mark = "close"; // placeholder, will get mark later
        const p2Mark = "circle"; // placeholder, will get mark later

        boardArray.forEach((tile, index) => {
            const htmlMark = display.querySelector(`button[data-index='${index}'] > span`);
            
            if (tile === "") {
                htmlMark.classList.add("transparent")
            } else if (tile === "1") {
                htmlMark.textContent = p1Mark;
                htmlMark.classList.remove("player2", "transparent");
                htmlMark.classList.add("player1")
            } else if (tile === "2") {
                htmlMark.textContent = p2Mark;
                htmlMark.classList.remove("player1", "transparent");
                htmlMark.classList.add("player2")
            }
        });
    };

    return {
        updateDisplay,
    };
})(DISPLAY);

const Player = (name, mark) => {
    let playerName = name;
    let playerMark = mark;

    const placeMark = (index) => {
        if (!gameBoard.isValidMove(index)) {
            console.log(gameBoard.isValidMove(index));
            return;
        }

        gameBoard.setTile(index, mark);
    };

    const getName = () => playerName;
    const getMark = () => playerMark;
    
    const setName = (newName) => {
        playerName = newName;
    }

    const setMark = (newMark) => {
        playerMark = newMark;
    }

    return {
        placeMark,
        getName,
        getMark,
        setName,
        setMark
    };
};
