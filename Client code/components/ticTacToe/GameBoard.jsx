import classes from "./gameBoard.module.css";
import Image from "next/image";

export default function GameBoard({ selectedPlayer, board, isGameActive }) {
  return (
    <div
      className={`${classes.board_container} ${
        !isGameActive ? "" : classes.inactive
      }`}
    >
      <div className={classes.game_board}>
        {board.map((row, rowIndex) => (
          <div className={classes.row} key={rowIndex}>
            {row.map((playerSymbol, colIndex) => (
              <div
                className={`${classes.cell} ${
                  !isGameActive ? classes.disabled : ""
                }`}
                key={colIndex}
              >
                <button
                  onClick={
                    !isGameActive
                      ? null
                      : () => selectedPlayer(rowIndex, colIndex)
                  }
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol === "X" && (
                    <Image
                      src="/player_X.png"
                      alt={`player ${playerSymbol} token`}
                      width={80}
                      height={80}
                      className={classes.image}
                    />
                  )}
                  {playerSymbol === "O" && (
                    <Image
                      src="/player_O.png"
                      alt={`player ${playerSymbol} token`}
                      width={80}
                      height={80}
                      className={classes.image}
                    />
                  )}
                </button>
              </div>
            ))}
          </div>
        ))}
        <div className={classes.horizontal_line1}></div>
        <div className={classes.horizontal_line2}></div>

        <div className={classes.vertical_line1}></div>
        <div className={classes.vertical_line2}></div>
      </div>
    </div>
  );
}
