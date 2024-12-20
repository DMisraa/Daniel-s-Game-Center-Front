import "./gameBoard.css";
import Image from "next/image";

function GameBoard({
  winner,
  handleNewGame,
  handleMove,
  board,
  hasDraw,
  playerChallenged,
  playerId,
  handleNewGameReq,
  newGameChallenge,
  isGameActive
}) {
  if (winner === "Red Player") {
    winner = "the Red Player";
  } else if (winner === "Yellow Player") {
    winner = "the Yellow Player";
  }

  return (
    <div className="game-container">
      {winner && (
        <div className="winner-announcement">
          The winner is {winner}!
          {!newGameChallenge ? (
            <button className="rematch-button" onClick={handleNewGameReq}>
              Rematch
            </button>
          ) : playerChallenged !== playerId ? (
            <div>
              <p>You have been challenged for a rematch!</p>
              <button onClick={handleNewGame}>Accept</button>
              <button>Not up for another one</button>
            </div>
          ) : (
            <p>Waiting for an answer...</p>
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
          ) : playerChallenged !== playerId ? (
            <div>
              <p>You have been challenged for a rematch!</p>
              <button onClick={handleNewGame}>Accept</button>
              <button>Not up for another one</button>
            </div>
          ) : (
            <p>Waiting for an answer...</p>
          )}
        </div>
      )}
      <div className={`board_container ${!isGameActive ? '' : 'inactive'}`}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="row">
            {row.map((cell, columnIndex) => (
              <div
                key={columnIndex}
                className={`cell ${!isGameActive ? 'disabled' : ''}`}
                onClick={!isGameActive ? null : () => handleMove(columnIndex)}
              >
                {!cell && <div className={'token'} />}
                {cell === "red" && (
                <Image
                  src={"/red_token.png"} 
                  alt={`${cell} player token`}
                  fill
                  style={{ objectFit: 'contain' }}
                />

                )}
                {cell === "blue" && (
                  <Image
                    src={"/blue_token.png"} 
                    alt={`${cell} player token`}
                    fill
                    style={{ objectFit: 'contain' }}
                  />
                  )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default GameBoard;
