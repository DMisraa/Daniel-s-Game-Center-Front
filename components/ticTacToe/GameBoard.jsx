import classes from './gameBoard.module.css'

export default function GameBoard({selectedPlayer, board }) {
  console.log(board, 'board, GameBoard Component')
 
    return (
      <ol id={classes["game-board"]}>
        {board.map((row, rowIndex) => (
          <li key={rowIndex}>
            <ol>
              {row.map((playerSymbol, colIndex) => (
                <li key={colIndex}>
                  <button onClick={() =>selectedPlayer(rowIndex, colIndex)} disabled={playerSymbol !== null}>
                    {playerSymbol}
                  </button>
                </li>
              ))}
            </ol>
          </li>
        ))}
      </ol>
    );
  }
  