import classes from "./modalheader.module.css";
import Image from "next/image";

function ModalHeader({ onClose, gameInviteOff }) {
  return (
    <div className={classes.container}>
      {!gameInviteOff && (
        <div className={classes.close_icon_wrapper}>
          <Image
            src="/close_icon.png"
            alt="close icon"
            width={32}
            height={32}
            onClick={onClose}
          />
        </div>
      )}
      <div className={classes.challenge_friend_icon_wrapper}>
        <Image
          src="/challenge_friend_icon.png"
          alt="Icon of a hand with two fingers making a cool gesture"
          width={120}
          height={130}
        />
      </div>

      <p> Challenge a friend to a Epic Match! </p>
    </div>
  );
}

export default ModalHeader;
