'use client'

import { updatePlayerName } from '../../app/ticTacToe_server'
import { useState } from "react";
import classes from './player.module.css'

export default function Player({ name, symbol, isActive, newPlayerName }) {
const [playerName, setPlayerName] = useState(name)
const [isEditing, setIsEditing] = useState(false);


function handleEditClick() {
  setIsEditing((editing) => !editing)

  if (isEditing) {
    newPlayerName(symbol, playerName)
    updatePlayerName(playerName, symbol)
  }
}

function handleChange(event) {
  name = event.target.value
  setPlayerName(event.target.value)
}

function handleKeyPress(event) {
  if (event.key === "Enter") {
    handleEditClick();
  } 
}



  return (
    <li className={isActive ? 'classes.active' : undefined } >
      <span className="player">
        {!isEditing ? <span className={classes['player-name']}>{name}</span> : 
        <input type='text' required placeholder={name} onChange={handleChange} onKeyPress={handleKeyPress} autoFocus ></input>}
        
         <span className="player-symbol">{symbol}</span>
      </span>
      <button onClick={handleEditClick} >{isEditing ? 'Save' : 'Edit'}</button>
    </li>
  );
}