import React from 'react';
import GameRestart from './GameRestart';

function Settings(props) {
    return (
        <div>
            <h2>Board Dimensions</h2>
            <label>Rows:</label>
            <input
                name="row"
                type="number"
                min="0"
                max="50"
                value={props.rows}
                onChange={(e) => props.onClick(e.target.name, e.target.value)}
            ></input>
            <label>Columns:</label>
            <input
                name="col"
                type="number"
                min="0"
                max="50"
                value={props.cols}
                onChange={(e) => props.onClick(e.target.name, e.target.value)}
            ></input>
            <GameRestart onClick={props.onRestart}></GameRestart>
        </div>
    );
}

export default Settings;
