import Modal from "./Modal/Modal";

import classes from "./winner.module.css";
import Image from "next/image";

function Draw({ handleStartGame, newChallengeModal, gameType, isModalOpen, closeModal }) {

  return (
    <>
      <div className={classes.declaration_container}>
        <Image
          src="/draw_logo.png"
          alt={"two friends posing to the camera"}
          width={220}
          height={360}
        />
        <div className={classes.winner_name}>
          <div>
            <h2> Draw! </h2>
            <h3> No Winner This Time </h3>
            <h5>
              Looks like it was a close match! Try again to see who can take the lead
            </h5>
          </div>
        </div>
        <div className={classes.buttons_container}>
          <button
            onClick={handleStartGame}
            className={classes["start-game-button"]}
          >
            Start to play !
          </button>
          <button className={classes["challenge-friend"]} onClick={newChallengeModal}>
            Challenge A Friend !
          </button>
        </div>
        <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        gameType={gameType}
      />
      </div>
    </>
  );
}

export default Draw;
