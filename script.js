const DISPLAY = document.querySelector("#board");

// Game board module
const gameBoard = (() => {
    let boardArray = ["x", "x", "x", "o", "", "o", "x", "", ""];

    const setTile = (position, mark) => {
        boardArray[position.x][position.y] = mark;
    };

    const isValidMove = (position) => boardArray[position.x][position.y] === "";
    const getBoard = () => boardArray;

    const clearGrid = () => {
        boardArray = ["", "", "", "", "", "", "", "", ""];
    };

    return {
        setTile,
        clearGrid,
        isValidMove,
        getBoard,
    };
})();

const displayController = ((display) => {
    const cross = document.querySelector(".hidden-elements .cross");
    const circle = document.querySelector(".hidden-elements .circle");

    const updateDisplay = () => {
        const boardArray = gameBoard.getBoard();

        boardArray.forEach((mark, index) => {
            if (mark === "") return;

            const button = display.querySelector(`button[data-index='${index}']`);
            button.innerHTML = "";

            if (mark === "x") {
                button.appendChild(cross.cloneNode(true));
            } else if (mark === "o") {
                button.appendChild(circle.cloneNode(true));
            }
        });
    };

    return {
        updateDisplay,
    };
})(DISPLAY);

const Player = (name, mark) => {
    const takeTurn = (position) => {
        if (!gameBoard.isValidMove(position)) {
            return;
        }

        gameBoard.setTile(position, mark);
    };

    const getName = () => name;
    const getMark = () => mark;

    return {
        takeTurn,
        getName,
        getMark,
    };
};
