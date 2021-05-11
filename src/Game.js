import React from 'react';
import Settings from './Settings';
import Board from './Board';

function calculateWinner(playerCounts, winCount) {
    let win = { winningPlayer: null, winningPathIndex: null };
    [...playerCounts].forEach((player, playerIndex) =>
        [...player].forEach((count, countIndex) => {
            if (count >= winCount) {
                win = { winningPlayer: playerIndex, winningPathIndex: countIndex };
            }
        }),
    );

    return win;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            numCols: 3,
            numRows: 3,
            winCount: 3,
            history: [],
            moveNumber: 0,
            xIsNext: true,
            numPlayers: 2,
            playerCounts: [],
        };

        let startingSquares = new Array();
        for (let i = 0; i < this.state.numRows; i++) {
            startingSquares.push(new Array());
            for (let j = 0; j < this.state.numCols; j++) {
                startingSquares[i].push({ value: null, win: false });
            }
        }

        this.state.history.push({ squares: startingSquares, move: null });

        // this.state.history.push({
        //     squares: Array(this.state.numRows)
        //         .fill(0)
        //         .map((row) => new Array(this.state.numCols).fill({ value: null, win: false })),
        // });

        // assuming perfectly square board
        let playerCounts = Array(this.state.numPlayers)
            .fill(0)
            .map((player) => new Array(this.state.numRows + this.state.numCols + 2).fill(0));
        this.state.playerCounts = playerCounts;

        this.generateStartingState = this.generateStartingState.bind(this);
    }

    generateStartingState(newRowDim, newColDim) {
        // const rows = this.state.numRows;
        // const cols = this.state.numCols;
        const rows = newRowDim;
        const cols = newColDim;
        console.log(`rows: ${rows}`);
        console.log(`cols: ${cols}`);

        let freshHistory = [];
        let startingSquares = new Array();
        for (let i = 0; i < rows; i++) {
            startingSquares.push(new Array());
            for (let j = 0; j < cols; j++) {
                startingSquares[i].push({ value: null, win: false });
            }
        }

        freshHistory.push({ squares: startingSquares, move: null });
        console.log(`freshHistory: ${freshHistory[0].squares.length}`);
        for (let i = 0; i < rows; i++) {
            for (let j = 0; j < cols; j++) {
                console.log(freshHistory[0].squares[i][j]);
            }
        }

        // this.state.history.push({
        //     squares: Array(this.state.numRows)
        //         .fill(0)
        //         .map((row) => new Array(this.state.numCols).fill({ value: null, win: false })),
        // });

        let playerCounts = Array(this.state.numPlayers)
            .fill(0)
            .map((player) => new Array(rows + cols + 2).fill(0));

        this.setState({
            winCount: newRowDim,
            history: freshHistory,
            moveNumber: 0,
            xIsNext: true,
            playerCounts: playerCounts,
        });
    }

    updateCounts(player, chosenRow, chosenCol) {
        let allCounts = this.state.playerCounts;
        let playerCounts = allCounts[player];

        // update count for row the chosen move is in
        playerCounts[chosenRow]++;

        // update count for column the chosen move is in
        playerCounts[chosenCol + this.state.numRows]++;

        // update count for diagonal the chosen move is in, if any
        if (chosenRow === chosenCol) {
            // on left to right, top to bottom diagonal
            playerCounts[this.state.numRows + this.state.numCols]++;
        }
        if (chosenRow + chosenCol + 1 === this.state.numRows) {
            // on right to left, top to bottom diagonal
            playerCounts[this.state.numRows + this.state.numCols + 1]++;
        }

        allCounts[player] = playerCounts;
        this.setState({ playerCounts: allCounts });
    }

    markWinningSquares(winningPathIndex) {
        const totalRows = this.state.numRows;
        const totalCols = this.state.numCols;
        let squares = this.state.history[this.state.history.length - 1].squares.slice();
        if (winningPathIndex < totalRows) {
            // index is the row number, mark all squares in that row
            for (let col = 0; col < totalCols; col++) {
                squares[winningPathIndex][col].win = true;
            }
        } else if (winningPathIndex < totalRows + totalCols) {
            // index specifies which col, mark all squares in that col
            for (let row = 0; row < totalRows; row++) {
                squares[row][winningPathIndex - totalRows].win = true;
            }
        } else if (winningPathIndex < totalRows + totalCols + 1) {
            // mark all squares in diagonal going right to left, top to bottom
            for (let i = 0; i < totalRows; i++) {
                squares[i][i].win = true;
            }
        } else {
            // mark all squares in diagonal going left to right, top to bottom
            for (let i = 0; i < totalRows; i++) {
                squares[i][totalRows - 1 - i].win = true;
            }
        }
    }

    handleClick(row, col) {
        const history = this.state.history.slice(0, this.state.moveNumber + 1);
        // const { ...current } = history;
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const { winningPlayer, winningPathIndex } = calculateWinner(this.state.playerCounts, this.state.winCount);
        if (squares[row][col].value || winningPlayer != null) {
            return;
        }

        squares[row][col].value = this.state.xIsNext ? 'X' : 'O';
        const player = this.state.xIsNext ? 0 : 1;
        this.updateCounts(player, row, col);

        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    move: { row: row, col: col },
                },
            ]),
            xIsNext: !this.state.xIsNext,
            moveNumber: ++this.state.moveNumber,
        });
    }

    jumpToMove(i) {
        this.setState({
            xIsNext: i % 2 === 0,
            moveNumber: i,
        });
    }

    updateDimensions(fieldName, value) {
        switch (fieldName) {
            case 'row':
                this.setState({ numRows: value, numCols: value });
                this.generateStartingState(value, value);
                break;
            case 'col':
                this.setState({ numRows: value, numCols: value });
                this.generateStartingState(value, value);
                break;
            default:
                break;
        }
    }

    render() {
        // const { ...currentBoardState } = this.state.history;
        const history = this.state.history;
        const currentBoardState = history[this.state.moveNumber];
        // const winningPath = calculateWinner(currentBoardState.squares);
        const { winningPlayer, winningPathIndex } = calculateWinner(this.state.playerCounts, this.state.winCount);
        let status;
        if (winningPlayer != null) {
            status = `${winningPlayer === 0 ? 'X' : 'O'} is the Winner!`;
            this.markWinningSquares(winningPathIndex);
        } else if (this.state.moveNumber === 9) {
            status = `It's a draw!`;
        } else {
            status = `Next player: ${this.state.xIsNext ? 'X' : 'O'}`;
        }
        const moves = history.map((boardState, index) => {
            const buttonText = index === 0 ? 'Go to game start' : `Go to move #${index}`;
            return (
                <li key={index}>
                    <button
                        className={`${index === this.state.moveNumber ? 'selectedMove' : ''}`}
                        onClick={() => this.jumpToMove(index)}
                    >
                        {buttonText}
                    </button>
                    <p>{boardState.move ? `(${boardState.move.row + 1}, ${boardState.move.col + 1})` : ''}</p>
                </li>
            );
        });

        return (
            <div className="game">
                <Settings
                    rows={this.state.numRows}
                    cols={this.state.numCols}
                    onClick={(fieldName, value) => this.updateDimensions(fieldName, value)}
                    onRestart={() => this.generateStartingState(this.state.numRows, this.state.numCols)}
                ></Settings>
                <div className="game-board">
                    <Board
                        rows={this.state.numRows}
                        cols={this.state.numCols}
                        squares={currentBoardState.squares}
                        onClick={(row, col) => this.handleClick(row, col)}
                    />
                </div>
                <div className="game-info">
                    {/* <div>{status}</div> */}
                    <div className="status">{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

export default Game;
