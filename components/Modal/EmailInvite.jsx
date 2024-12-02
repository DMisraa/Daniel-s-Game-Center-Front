"use client";

import ModalHeader from "./ModalHeader";
import ModalClosePage from "./ModalClosePage";
import ModalEmailInput from "./ModalEmailInput";
import ModalButton from "./ModalButton";
import NavigationButtons from "./Components/NavigationButtons";

import { gameInvite } from "@/app/server";
import classes from "./emailInvite.module.css";
import { useState } from "react";

function EmailInvite({ closeEmailInvite, onClose, gameType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isClosePage, setIsClosePage] = useState(false);
  const [gameCreatorGameLink, setGameCreatorGameLink] = useState('')

  let gameLink = <a href={gameCreatorGameLink}>here</a>;

  let gamelinkText = (
    <>
      {"but if it's too much for you, the game link is also "}
      {gameLink}
    </>
  );

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = {
      userEmail: event.target.email.value,
      rivalUserEmail: event.target.friend_email.value,
      userName: event.target.name.value,
      rivalName: event.target.friend_name.value,
    };

    const { gameCreatorLink } = await gameInvite(formData, gameType);
    event.target.reset();
    setIsClosePage(true);
    setIsLoading(false);

    console.log('gameCreatorLink:', gameCreatorLink, 'formData:', formData)
    setGameCreatorGameLink(gameCreatorLink)

    return { gameCreatorLink, formData };
  }

  function closeModal() {
    closeEmailInvite();
    onClose();
  }

  return (
    <>
      {!isClosePage && (
        <div className={classes.container}>
          <>
            <div className={classes.button_container}>
              <NavigationButtons
                closeEmailInvite={closeEmailInvite}
                closeModal={closeModal}
              />
            </div>

            <ModalHeader gameInviteOff={true} />
            <form onSubmit={handleSubmit}>
              <ModalEmailInput />
              <ModalButton text={isLoading ? "Going.." : "Lets go!"} />
            </form>
          </>
        </div>
      )}

      {isClosePage && (
        <div className={classes.closePage_container}>
          <ModalClosePage
            gameType={gameType}
            closeModal={closeModal}
            whatsappInvite={false}
            mainText={"Invitation sent!"}
            secondaryText={"Your game link is waiting for you in your inbox"}
            gamelinkText={gamelinkText}
            emailGameLink={gameCreatorGameLink}
          />
        </div>
      )}
    </>
  );
}

export default EmailInvite;
