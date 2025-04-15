"use client";

import { updatePlayerName } from "../../app/ticTacToe_server";
import { useState } from "react";
import classes from "./player.module.css";

export default function Player({
  name,
  symbol,
  isActive,
  newPlayerName,
  player,
  score
}) {
  const [playerName, setPlayerName] = useState(name);
  const [isEditing, setIsEditing] = useState(false);

  function handleEditClick() {
    setIsEditing((editing) => !editing);

    if (isEditing) {
      newPlayerName(symbol, playerName);
      updatePlayerName(playerName, symbol);
    }
  }

  function handleChange(event) {
    name = event.target.value;
    setPlayerName(event.target.value);
  }

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleEditClick();
    }
  }

  return (
    <div className={classes.container}>
      <span className={classes.player}>
        <h4> {player} </h4>
        {!isEditing ? (
          <h2 className={classes["player-name"]}>{name}</h2>
        ) : (
          <input
            type="text"
            required
            placeholder={name}
            onChange={handleChange}
            onKeyPress={handleKeyPress}
            autoFocus
            maxLength={9}
          />
        )}
        {newPlayerName && (
          <button onClick={handleEditClick}>
            {isEditing ? "Save" : "Edit"}
          </button>
        )}
      </span>
      <div className={classes.score}>
        <h4> Score </h4>
        <h2> {score} </h2>
      </div>
    </div>
  );
}
