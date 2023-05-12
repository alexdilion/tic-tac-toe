const gameBoard = (() => {
    let gridArray = [["", "", ""], ["", "", ""], ["", "", ""]];

    const setTile = (mark, position) => {
        gridArray[position.x][position.y] = mark;
    }

    const clearGrid = () => {
        gridArray = [["", "", ""], ["", "", ""], ["", "", ""]];
    }

    return {
        setTile,
        clearGrid
    }
})();