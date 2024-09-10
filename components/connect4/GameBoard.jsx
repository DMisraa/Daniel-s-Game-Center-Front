import "./gameBoard.css";

function GameBoard({ winner, handleNewGame, handleMove, board, hasDraw, playerChallenged, playerId, handleNewGameReq, newGameChallenge }) {

  if (winner === "Red Player") {
    winner = "the Red Player";
  } else if (winner === "Yellow Player") {
    winner = "the Yellow Player";
  }

  console.log(newGameChallenge, 'newGameChallenge gameBoard Component')
  console.log(playerChallenged, 'playerChallenged gameBoard Component')
  console.log(playerId, 'playerId gameBoard Component')

  return (
    <div className="game-container">
      {winner && (
        <div className="winner-announcement">
          The winner is {winner}!
          {!newGameChallenge ? (
            <button className="rematch-button" onClick={handleNewGameReq}>
              Rematch
            </button>
          ) : (
            playerChallenged !== playerId ? (
              <div>
                <p>You have been challenged for a rematch!</p>
                <button onClick={handleNewGame}>Accept</button>
                <button>Not up for another one</button>
              </div>
            ) : (
              <p>Waiting for an answer...</p>
            )
          )}
        </div>
      )}
      {hasDraw && (
        <div className="winner-announcement">
          It&apos;s a Draw !
          {!newGameChallenge ? (
            <button className="rematch-button" onClick={handleNewGameReq}>
              Rematch
            </button>
          ) : (
            playerChallenged !== playerId ? (
              <div>
                <p>You have been challenged for a rematch!</p>
                <button onClick={handleNewGame}>Accept</button>
                <button>Not up for another one</button>
              </div>
            ) : (
              <p>Waiting for an answer...</p>
            )
          )}
        </div>
      )}
      <div className="game-board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, columnIndex) => (
              <div
                key={columnIndex}
                className="cell"
                onClick={() => handleMove(columnIndex)}
              >
                {/* Render player's token or empty slot */}
                {cell && <div className={`token ${cell}`} />}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
