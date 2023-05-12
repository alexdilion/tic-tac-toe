const gameBoard = (() => {
    let gridArray = [
        ["", "", ""],
        ["", "", ""],
        ["", "", ""],
    ];

    const setTile = (position, mark ) => {
        gridArray[position.x][position.y] = mark;
    };

    const isValidMove = (position) => gridArray[position.x][position.y] === "";

    const clearGrid = () => {
        gridArray = [
            ["", "", ""],
            ["", "", ""],
            ["", "", ""],
        ];
    };

    return {
        setTile,
        clearGrid,
        isValidMove,
    };
})();

const Player = (name, mark) => {
    const takeTurn = (position) => {
        if (!gameBoard.isValidMove(position)) {
            return;
        }

        gameBoard.setTile(position, mark)
    };

    return {takeTurn};
};
