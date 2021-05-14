import React from 'react';
import './Board.css';
import Square from './Square';

const Board = (props) => {
    function renderSquare(row, col) {
        return (
            <Square
                value={props.squares[row][col].value}
                key={row * 3 + col}
                win={props.squares[row][col].win}
                onClick={() => props.onClick(row, col)}
            />
        );
    }

    let board = [];
    let boardRow = [];
    for (let row = 0; row < props.rows; row++) {
        for (let col = 0; col < props.cols; col++) {
            boardRow.push(renderSquare(row, col));
        }
        board.push(
            <div className="board-row" key={row}>
                {boardRow}
            </div>,
        );
        boardRow = [];
    }

    return <div className={props.className}>{board}</div>;
};

export default Board;
