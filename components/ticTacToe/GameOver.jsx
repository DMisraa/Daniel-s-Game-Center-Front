import classes from "./gameOver.module.css";
export default function GameOver({
  winner,
  newGame,
  newGameChallenge,
  playerChallenged = 0,
  playerId, handleNewGame, 
}) {
  const onlineGameRematch = (
    <>
      {!newGameChallenge ? (
        <button className="rematch-button" onClick={newGame}>
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
    </>
  );
  return (
    <div id={classes["game-over"]}>
      <h2> Game Over!</h2>
      {winner && (
        <>
          <p> {winner} Won!</p> {onlineGameRematch}
        </>
      )}
      {!winner && (
        <>
          <p> I&apos;ts a draw !</p> {onlineGameRematch}
        </>
      )}
     
    </div>
  );
}
