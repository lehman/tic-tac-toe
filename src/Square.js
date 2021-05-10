import React from 'react';

function Square(props) {
    return (
        <button className={`square ${props.win ? 'win' : ''}`} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

export default Square;
