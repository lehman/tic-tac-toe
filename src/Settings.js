import React from 'react';
import './Settings.css';
import GameRestart from './GameRestart';

function Settings(props) {
    return (
        <div className={props.className}>
            <div className="setting">
                <label>Dark Mode</label>
                <input
                    name="dark-mode"
                    type="checkbox"
                    value={props.darkMode}
                    onChange={props.onToggleDarkMode}
                ></input>
            </div>
            <h2>Board Dimensions</h2>
            <div className="setting">
                <label>Rows</label>
                <input
                    name="row"
                    type="number"
                    min="0"
                    max="50"
                    value={props.rows}
                    onChange={(e) => props.onClick(e.target.name, e.target.value)}
                ></input>
            </div>
            <div className="setting">
                <label>Columns</label>
                <input
                    name="col"
                    type="number"
                    min="0"
                    max="50"
                    value={props.cols}
                    onChange={(e) => props.onClick(e.target.name, e.target.value)}
                ></input>
            </div>
            <GameRestart onClick={props.onRestart} className="restartButton"></GameRestart>
        </div>
    );
}

export default Settings;
