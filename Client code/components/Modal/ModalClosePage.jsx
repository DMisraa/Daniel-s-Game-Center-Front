import ModalButton from "./ModalButton";

import Image from "next/image";
import classes from './modalClosePage.module.css'
import { gameInvite } from "@/app/server";

function ModalClosePage({ gameType, formData, closeModal, whatsappInvite, mainText, secondaryText, gamelinkText }) {
  async function handleWhatsAppSubmit(event) {
    event.preventDefault();
    let message, gameLink;
    let whatsappInvite = true;

    const { gameCreatorLink, invitedPlayerLink } = await gameInvite(
      formData,
      gameType,
      whatsappInvite
    );

    if (gameType === "ticTacToe") {
      gameLink = invitedPlayerLink;
      message = `Hey ! Lets play ticTacToe ! Click the link to join me: ${gameLink}`;
    } else if (gameType === "connectFour") {
      gameLink = invitedPlayerLink;
      message = `Hey! Let's play Connect Four! Click the link to join me: ${gameLink}`;
    }

    const encodedMessage = encodeURIComponent(message);
    const whatsAppUrl = `https://wa.me/${formData.phoneNumber}?text=${encodedMessage}`;
    const androidWhatsAppUrl = `intent://send/?phone=${formData.phoneNumber}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end`;

    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    const isAndroid = /Android/i.test(navigator.userAgent);

    event.target.reset();

    if (isMobile) {
      if (isAndroid) {
        window.location.href = androidWhatsAppUrl;
      } else {
        window.location.href = whatsAppUrl;
      }

      setTimeout(() => {
        if (!document.hidden) {
          window.location.href = gameCreatorLink;
        }
      }, 3000); 
    } else {
      window.open(whatsAppUrl, "_blank");
      setTimeout(() => {
        window.location.href = gameCreatorLink;
      }, 3000); }
  }

  function emaiiInvite(event) {
    event.preventDefault()
  }

  return (
    <div className={classes.container} >
      <Image
        src={"/flying_frisbee.png"}
        alt="Flying frisbee"
        width={200}
        height={150}
      />
      <h2> {mainText} </h2>
      <h5> {secondaryText} </h5>
      <h5> {gamelinkText} </h5>
      <form onSubmit={whatsappInvite ? handleWhatsAppSubmit : emaiiInvite}>
        <ModalButton text={"Close"} closeModal={closeModal} />
      </form>
    </div>
  );
}

export default ModalClosePage;

