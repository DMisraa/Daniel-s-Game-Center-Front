'use client'

import { updatePlayerName } from '../../app/ticTacToe_server'
import { useState } from "react";
import classes from './player.module.css'

export default function Player({ name, symbol, isActive, newPlayerName }) {
const [playerName, setPlayerName] = useState(name)
const [isEditing, setIsEditing] = useState(false);
console.log(playerName, 'player name Player component')


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
    <li className={isActive ? `${classes.active}` : undefined } >
      <span className={classes.player}>
        {!isEditing ? <span className={classes['player-name']}>{name}</span> : 
        <input type='text' required placeholder={name} onChange={handleChange} onKeyPress={handleKeyPress} autoFocus ></input>}
        
         <span className={classes["player-symbol"]}>{symbol}</span>
      </span>
       {newPlayerName && <button onClick={handleEditClick} >{isEditing ? 'Save' : 'Edit'}</button>} 
    </li>
  );
}