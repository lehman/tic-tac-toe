import React from 'react';

function GameRestart(props) {
    return (
        <div className={props.className}>
            <button onClick={props.onClick}>Restart Game</button>
        </div>
    );
}

export default GameRestart;
