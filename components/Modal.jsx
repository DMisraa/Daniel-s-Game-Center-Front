import { useRef, useEffect, useState } from "react";
import classes from "./modal.module.css";
import { fetchOnlineMatch, gameInvite } from "@/app/server";
import { fetchData } from "@/app/ticTacToe_server";

export default function Modal({ isOpen, onClose, gameType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [WhatsAppInvite, setWhatsAppInvite] = useState(false);
  const dialogRef = useRef(null);
  console.log(isOpen);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (isOpen && dialog) {
      dialog.showModal();
    } else if (dialog) {
      dialog.close();
    }

    // if (!isOpen) {
    //   function handleOutsideClick(event) {
    //   if (dialog && !dialog.contains(event.target)) {
    //     onClose();
    //   }
    // }
    // window.addEventListener("click", handleOutsideClick);
    // }
    // return () => {
    //   window.removeEventListener("click", handleOutsideClick);
    // };
    // = funtion for closing the modal when user click outside of it
  }, [isOpen, onClose]);

  function handleWhatsAppCheckbox() {
    setWhatsAppInvite(prevState => !prevState);
  }

  function handleClose() {
    onClose();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = {
      userEmail: event.target.userEmail.value,
      rivalUserEmail: event.target.rivalUserEmail.value,
      userName: event.target.yourName.value,
      rivalName: event.target.rivalName.value,
      ...(WhatsAppInvite && {
        userNumber: event.target.userNumber.value,
        rivalNumber: event.target.rivalNumber.value
      })
    };
    
    const gameId = await gameInvite(formData, gameType);
    console.log(gameId, 'gameId of game Created')
    {!WhatsAppInvite && setIsLoading(false)}

    return { gameId, formData }
  }

  async function handleWhatsAppSubmit(event) {
    event.preventDefault();
    const { gameId, formData } =  await handleSubmit(event)

    let data, message, gameLink
    const phoneNumber = formData.rivalNumber
    
    if (gameType === 'ticTacToe') {
      data = await fetchData(gameId)
      console.log(data, 'data, whatsApp Invite')
      gameLink = data.gameLinksWithTokens.InvitedPlayer
      message = `Hey ! Lets play ticTacToe ! Join me here: ${gameLink}`
    } else if (gameType === 'connectFour') {
      data = await fetchOnlineMatch(gameId)
      console.log(data, 'data, whatsApp Invite')
      gameLink = data.gameLinksWithTokens.InvitedPlayer
      message = `Hey ! Lets play connectFour ! Join me here: ${gameLink}`
    }
    
    const encodedMessage = encodeURIComponent(message)
    const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}` 
    console.log(gameLink, 'gameLink', encodedMessage, 'encodedMessage', whatsAppUrl, 'whatsAppUrl')
    setTimeout(() => {
      window.open(whatsAppUrl, '_blank');
  }, 200);

    setIsLoading(false)

  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className={classes["modal-dialog"]}
    >
      <div className={classes["modal-overlay"]}>
        <div className={classes["modal-content"]}>
          <button className={classes["close-button"]} onClick={onClose}>
            Close
          </button>
          <h2>🎉 Challenge a Friend to an Epic Match! 🚀</h2>
          <form onSubmit={WhatsAppInvite ? handleWhatsAppSubmit : handleSubmit}>
            <div>
              <label htmlFor="userEmail">Your Email</label>
              <input type="email" id="userEmail" name="userEmail" required />
            </div>
            <div>
              <label htmlFor="rivalUserEmail">Rival&apos;s Email:</label>
              <input
                type="email"
                id="rivalUserEmail"
                name="rivalUserEmail"
                required
              />
            </div>
            <div>
              <label htmlFor="userName">Your Name:</label>
              <input type="text" id="yourName" name="yourName" required />
            </div>
            <div>
              <label htmlFor="rivalName">Rival&apos;s Name:</label>
              <input type="text" id="rivalName" name="rivalName" required />
            </div>
            <div>
              <label>Invite via WhatsApp</label>
              <input
                type="checkbox"
                name="checkbox"
                onClick={handleWhatsAppCheckbox}
              />
            </div>
            {WhatsAppInvite && (
              <div>
                <label htmlFor="userNumber">Your Phone Number:</label>
                <input
                  type="tel"
                  id="userNumber"
                  name="userNumber"
                  pattern="[+]{1}[0-9]{11,14}"
                  placeholder="+12345678901"
                />
                <div>
                <label htmlFor="rivalNumber">Rival&apos;s Phone Number:</label>
                <input
                  type="tel"
                  id="rivalNumber"
                  name="rivalNumber"
                  pattern="[+]{1}[0-9]{11,14}"
                  placeholder="+12345678901"
                />
                </div>
              </div>
            )}
            <button type="submit" disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit"}
            </button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
