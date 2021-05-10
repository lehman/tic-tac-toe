import React from 'react';
import Square from './Square';

class Board extends React.Component {
    renderSquare(row, col) {
        return (
            <Square
                value={this.props.squares[row][col].value}
                key={row * 3 + col}
                win={this.props.squares[row][col].win}
                onClick={() => this.props.onClick(row, col)}
            />
        );
    }

    render() {
        let board = [];
        let boardRow = [];
        for (let row = 0; row < this.props.rows; row++) {
            for (let col = 0; col < this.props.cols; col++) {
                boardRow.push(this.renderSquare(row, col));
            }
            board.push(
                <div className="board-row" key={row}>
                    {boardRow}
                </div>,
            );
            boardRow = [];
        }

        return <div>{board}</div>;
    }
}

export default Board;
