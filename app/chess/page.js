import Image from "next/image";
import classes from "./page.module.css";

export default function Chess() {
  return (
    <div className={classes.container}>
      <h1 className={classes.heading}>♟️ Chess Game</h1>

      <p className={classes.message}>
        Our Chess game is currently under constructions. Stay tuned for exciting
        updates!
      </p>
      <Image
        src={"/constructions.png"}
        alt="Under Construction"
        width={100}
        height={100}
        priority
        className={classes.image}
      />
    </div>
  );
}
