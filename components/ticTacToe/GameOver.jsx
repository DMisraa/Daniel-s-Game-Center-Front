import classes from './gameOver.module.css'
export default function GameOver({ winner, newGame }) {
    return (
      <div id={classes["game-over"]}>
        <h2> Game Over!</h2>
        {winner && <p> {winner} Won!</p>}
        {!winner && <p> I&apos;ts a draw !</p>}
        <p>
          <button onClick={newGame}>Rematch</button>
        </p>
      </div>
    );
  }
  