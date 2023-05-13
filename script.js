const DISPLAY = document.querySelector("body")

// Game board module
const gameBoard = (() => {
    let boardArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const setTile = (position, mark ) => {
        boardArray[position.x][position.y] = mark;
    };

    const isValidMove = (position) => boardArray[position.x][position.y] === "";
    const getBoard = () => boardArray;

    const clearGrid = () => {
        boardArray = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    };

    return {
        setTile,
        clearGrid,
        isValidMove,
        getBoard
    };
})();

const displayController = ((display) => {
    console.log("Doing something");
})(DISPLAY);

const Player = (name, mark) => {
    const takeTurn = (position) => {
        if (!gameBoard.isValidMove(position)) {
            return;
        }

        gameBoard.setTile(position, mark)
    };

    const getName = () => name

    return {
        takeTurn,
        getName
    };
};
