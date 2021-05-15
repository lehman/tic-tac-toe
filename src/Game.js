import React from 'react';
import './Game.css';
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
            darkMode: false,
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
        const rows = parseInt(newRowDim);
        const cols = parseInt(newColDim);

        let freshHistory = [];
        let startingSquares = new Array();
        for (let i = 0; i < rows; i++) {
            startingSquares.push(new Array());
            for (let j = 0; j < cols; j++) {
                startingSquares[i].push({ value: null, win: false });
            }
        }

        freshHistory.push({ squares: startingSquares, move: null });

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

    onToggleDarkMode() {
        this.setState(
            {
                darkMode: !this.state.darkMode,
            },
            () => {
                this.state.darkMode ? (document.body.className = 'darkMode') : (document.body.className = '');
            },
        );
    }

    addMoveToCounts(allPlayerCounts, player, chosenRow, chosenCol) {
        const rows = parseInt(this.state.numRows);
        const cols = parseInt(this.state.numCols);

        // update count for row the chosen move is in
        allPlayerCounts[player][chosenRow]++;

        // update count for column the chosen move is in
        allPlayerCounts[player][chosenCol + rows]++;

        // update count for diagonal the chosen move is in, if any
        if (chosenRow == chosenCol) {
            // on left to right, top to bottom diagonal
            allPlayerCounts[player][rows + cols]++;
        }
        if (chosenRow + chosenCol + 1 == this.state.numRows) {
            // on right to left, top to bottom diagonal
            allPlayerCounts[player][rows + cols + 1]++;
        }
    }

    updateCounts(player, chosenRow, chosenCol) {
        const rows = parseInt(this.state.numRows);
        const cols = parseInt(this.state.numCols);

        // history always has extra entry for initial blank board state
        if (this.state.moveNumber == this.state.history.length - 1) {
            // we're adding a move to the end
            let allPlayerCounts = this.state.playerCounts;
            this.addMoveToCounts(allPlayerCounts, player, chosenRow, chosenCol);
            this.setState({ playerCounts: allPlayerCounts });
        } else {
            // we jumped to a previous move in history and then made a new move,
            // so we need to redo all the counts
            let allPlayerCounts = Array(this.state.numPlayers)
                .fill(0)
                .map((player) => new Array(rows + cols + 2).fill(0));
            const latestBoardState = this.state.history[this.state.moveNumber].squares;

            let player = 0;
            for (let i = 0; i < rows; i++) {
                for (let j = 0; j < cols; j++) {
                    // latestBoardState[i][j].value ?? continue;
                    if (latestBoardState[i][j].value == null) {
                        continue;
                    }
                    latestBoardState[i][j].value === 'X' ? (player = 0) : (player = 1);
                    this.addMoveToCounts(allPlayerCounts, player, i, j);
                }
            }

            // since state history doesn't have the most recent move, add that count here
            this.addMoveToCounts(allPlayerCounts, player, chosenRow, chosenCol);
            this.setState({ playerCounts: allPlayerCounts });
        }
    }

    markWinningSquares(winningPathIndex) {
        const totalRows = parseInt(this.state.numRows);
        const totalCols = parseInt(this.state.numCols);
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
        let squares = JSON.parse(JSON.stringify(current.squares));

        const { winningPlayer, winningPathIndex } = calculateWinner(this.state.playerCounts, this.state.winCount);
        if (
            squares[row][col].value ||
            (winningPlayer != null && this.state.moveNumber == this.state.history.length - 1)
        ) {
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
            moveNumber: this.state.moveNumber + 1,
        });
    }

    jumpToMove(i) {
        this.setState({
            xIsNext: i % 2 === 0,
            moveNumber: parseInt(i),
        });
    }

    updateDimensions(fieldName, value) {
        switch (fieldName) {
            case 'row':
                this.setState({
                    numRows: value,
                    numCols: value,
                    winCount: value,
                });
                this.generateStartingState(value, value);
                break;
            case 'col':
                this.setState({
                    numRows: value,
                    numCols: value,
                    winCount: value,
                });
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
        if (winningPlayer != null && this.state.moveNumber == history.length - 1) {
            status = `${winningPlayer === 0 ? 'X' : 'O'} is the Winner!`;
            this.markWinningSquares(winningPathIndex);
        } else if (this.state.moveNumber === this.state.numRows * this.state.numCols) {
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
            <div className={`game ${this.state.darkMode ? 'darkMode' : ''}`}>
                <div className="title">
                    <h1>Tic</h1>
                    <h1>Tac</h1>
                    <h1>Toe</h1>
                </div>
                <Settings
                    rows={this.state.numRows}
                    cols={this.state.numCols}
                    onClick={(fieldName, value) => this.updateDimensions(fieldName, value)}
                    onRestart={() => this.generateStartingState(this.state.numRows, this.state.numCols)}
                    className="game-settings"
                    darkMode={this.state.darkMode}
                    onToggleDarkMode={() => this.onToggleDarkMode()}
                ></Settings>
                <div className="status">{status}</div>
                <div className="game-field">
                    {/* <div className="status">{status}</div> */}
                    <Board
                        rows={this.state.numRows}
                        cols={this.state.numCols}
                        squares={currentBoardState.squares}
                        onClick={(row, col) => this.handleClick(row, col)}
                        className="game-board"
                    />
                </div>
                <div className="game-history">
                    <h2>History</h2>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

export default Game;
