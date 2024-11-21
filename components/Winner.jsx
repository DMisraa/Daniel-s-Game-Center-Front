import classes from "./winner.module.css";
import Image from "next/image";

function Winner({ player, name, handleStartGame, newChallenge }) {
  return (
    <>
      <div className={classes.declaration_container}>
        <Image
          src="/winner_logo.png"
          alt={"man rasing cup"}
          width={220}
          height={360}
        />
        <div className={classes.winner_name}>
          <div>
            <h4> {player} </h4>
            <h3> {name} </h3>
          </div>
          <h2> Winner! </h2>
        </div>
        <div className={classes.buttons_container}>
        <button
          onClick={handleStartGame}
          className={classes["start-game-button"]}
        >
          Start to play !
        </button>
        <button className={classes["challenge-friend"]} onClick={newChallenge}>
          Challenge A Friend !
        </button>
      </div>
      </div>
    
    </>
  );
}

export default Winner;
