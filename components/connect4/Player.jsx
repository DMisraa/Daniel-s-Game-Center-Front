import React, { useEffect, forwardRef } from "react";
import './player.css'



const Player = forwardRef(function Player({ isEditing, handlePlayerName, handleEdit, name, isYellowActive, isRedActive }, ref )  {
  

  let playerCSS 

  if (isYellowActive) {
   playerCSS += ' yellow-active active' 
  } else if (isRedActive) {
    playerCSS += ' red-active active' 
  }

  useEffect(() => {
    if (isEditing && ref.current) {
      ref.current.focus();
    }
  }, [isEditing]);

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleEdit();
    }
    
  }

  return (
    <li className={playerCSS} >
      <span className= 'player' >
        {!isEditing ? (
          <span className="player-name"> {name} </span>
        ) : (
          <input
            ref={ref}
            placeholder={name}
            required
            type="text"
            onChange={handlePlayerName}
            onKeyPress={handleKeyPress}
            autoFocus
          />
        )}
      </span>
      <button onClick={handleEdit}> {isEditing ? "Save" : "Edit"} </button>
    </li>
  );
})

export default Player;
