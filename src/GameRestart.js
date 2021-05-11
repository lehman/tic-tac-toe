import React from 'react';

function GameRestart(props) {
    return (
        <div>
            <button onClick={props.onClick}>Restart Game</button>
        </div>
    );
}

export default GameRestart;
