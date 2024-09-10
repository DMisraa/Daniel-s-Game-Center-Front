import classes from "./allTimeScore.module.css";

function AllTimeScore({ allTimeGameScoreDraw, allTimeGameScorePlayerOne, allTimeGameScorePlayerTwo, playerOne, playerTwo }) {
  
  return (
    <div className={classes.scoreboard}>
      <h2>All Time Score!</h2>
      <h3>
        {playerOne} : <span>{allTimeGameScorePlayerOne}</span>
      </h3>
      <h3>
        Draw: <span>{allTimeGameScoreDraw}</span>
      </h3>
      <h3>
        {playerTwo} : <span>{allTimeGameScorePlayerTwo}</span>
      </h3>
    </div>
  );
}

export default AllTimeScore;
