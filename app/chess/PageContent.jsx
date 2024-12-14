import classes from "./pageContent.module.css";

function PageContent() {
  return (
    <div className={classes.container}>
      <div id={classes["game-container"]}>
        <h2 className={classes.game_text}> Coming Soon </h2>
      </div>
    </div>
  );
}

export default PageContent;
