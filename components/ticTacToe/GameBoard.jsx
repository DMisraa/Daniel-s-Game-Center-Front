import classes from "./gameBoard.module.css";
import Image from "next/image";

export default function GameBoard({ selectedPlayer, board }) {
  console.log(board, "board, GameBoard Component");

  return (
    <div className={classes.board_container}>
      <div className={classes.game_board}>
        {board.map((row, rowIndex) => (
          <div className={classes.row} key={rowIndex}>
            {row.map((playerSymbol, colIndex) => (
              <div className={classes.cell} key={colIndex}>
                <button
                  onClick={() => selectedPlayer(rowIndex, colIndex)}
                  disabled={playerSymbol !== null}
                >
                {playerSymbol === 'X' && (
                  <Image
                    src="/player_X.png"
                    alt={`player ${playerSymbol} token`}
                    width={80}
                    height={80}
                  />
                )}
                {playerSymbol === 'O' && (
                  <Image
                    src="/player_O.png"
                    alt={`player ${playerSymbol} token`}
                    width={80}
                    height={80}
                  />
                )}
              </button>
              </div>
            ))}
          </div>
        ))}
        <div className={classes.horizontal_line1}></div>
        <div className={classes.horizontal_line2}></div>

        {/* Vertical Lines */}
        <div className={classes.vertical_line1}></div>
        <div className={classes.vertical_line2}></div>
      </div>
    </div>
  );
}
