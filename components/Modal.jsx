import { useRef, useEffect, useState } from "react";
import classes from "./modal.module.css";
import { fetchOnlineMatch, gameInvite } from "@/app/server";
import { fetchData } from "@/app/ticTacToe_server";

export default function Modal({ isOpen, onClose, gameType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [WhatsAppInvite, setWhatsAppInvite] = useState(false);
  const dialogRef = useRef(null);
  console.log(isOpen, "isOpen State");

  useEffect(() => {
    const dialog = dialogRef.current;
  
    if (isOpen && dialog) {
      dialog.showModal();
  
      function handleOutsideClick(event) {
        const modalContent = dialog.querySelector(`.${classes['modal-content']}`);
        
        if (modalContent && !modalContent.contains(event.target)) {
          onClose();
        }
      };

      document.addEventListener("click", handleOutsideClick);
  
      return () => {
        document.removeEventListener("click", handleOutsideClick);
      };
    } else if (dialog) {
      dialog.close();
    }
  }, [isOpen, onClose]);

  function handleWhatsAppCheckbox() {
    setWhatsAppInvite((prevState) => !prevState);
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
        rivalNumber: event.target.rivalNumber.value,
      }),
    };

    const gameId = await gameInvite(formData, gameType);
    console.log(gameId, "gameId of game Created");
    {
      !WhatsAppInvite && setIsLoading(false);
    }

    return { gameId, formData };
  }

  async function handleWhatsAppSubmit(event) {
    event.preventDefault();
    const { gameId, formData } = await handleSubmit(event);

    let data, message, gameLink;
    const phoneNumber = formData.rivalNumber;
    
    if (gameType === "ticTacToe") {
      data = await fetchData(gameId);
      console.log(data, "data, whatsApp Invite");
      gameLink = data.gameLinksWithTokens.InvitedPlayer;
      message = `Hey! Let's play Tic-Tac-Toe! Join me here: ${gameLink}`;
    } else if (gameType === "connectFour") {
      data = await fetchOnlineMatch(gameId);
      console.log(data, "data, whatsApp Invite");
      gameLink = data.gameLinksWithTokens.InvitedPlayer;
      message = `Hey! Let's play Connect Four! Join me here: ${gameLink}`;
    }
    
    const encodedMessage = encodeURIComponent(message);
    const whatsAppUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    const androidWhatsAppUrl = `intent://send/?phone=${phoneNumber}&text=${encodedMessage}#Intent;scheme=whatsapp;package=com.whatsapp;end;`;

      const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
      const isAndroid = /Android/i.test(navigator.userAgent);
    
      if (isMobile) {
        {
          window.location.href = whatsAppUrl;
        }

        setTimeout(() => {
          if (!document.hidden) {
            window.location.href = whatsAppUrl;
          }
        }, 1500); 
      } else {
        window.open(whatsAppUrl, "_blank");
      }
    setIsLoading(false);
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
                  <label htmlFor="rivalNumber">
                    Rival&apos;s Phone Number:
                  </label>
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
