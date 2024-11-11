import React, { useEffect, forwardRef } from "react";
import "./player.css";

const Player = forwardRef(function Player(
  {
    isEditing,
    handlePlayerName,
    handleEdit,
    name,
    isYellowActive,
    isRedActive,
    player,
    score,
  },
  ref
) {
  let playerCSS;

  if (isYellowActive) {
    playerCSS += " yellow-active active";
  } else if (isRedActive) {
    playerCSS += " red-active active";
  }

  useEffect(
    () => {
      if (isEditing && ref.current) {
        ref.current.focus();
      }
    },
    [isEditing],
    ref
  );

  function handleKeyPress(event) {
    if (event.key === "Enter") {
      handleEdit();
    }
  }

  return (
    <div className={`${playerCSS} container`}>
      <span className="player">
        {!isEditing ? (
          <>
            <h4> {player} </h4>
            <h2 className="player-name"> {name} </h2>
          </>
        ) : (
          <>
            <h4> {player} </h4>
            <input
              ref={ref}
              placeholder={name}
              required
              type="text"
              onChange={handlePlayerName}
              onKeyPress={handleKeyPress}
              autoFocus
              maxLength={9}
            />
          </>
        )}

        {handleEdit && (
          <button onClick={handleEdit}> {isEditing ? "Save" : "Edit"} </button>
        )}
      </span>
      <div className="score">
        <h4> Score </h4>
        <h2> {score} </h2>
      </div>
    </div>
  );
});

export default Player;
