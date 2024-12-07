import GameInvite from "./GameInvite.jsx";

import { useRef, useEffect, useState } from "react";
import classes from "./modal.module.css";
import { fetchOnlineMatch, gameInvite } from "@/app/server";
import { fetchData } from "@/app/ticTacToe_server";


export default function Modal({ isOpen, onClose, gameType }) {
  const [isLoading, setIsLoading] = useState(false);
  const [WhatsAppInvite, setWhatsAppInvite] = useState(false);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
  
    if (isOpen && dialog) {
      dialog.showModal();
  
      return () => {
      };
    } else if (dialog) {
      dialog.close();
    }
  }, [isOpen, onClose]);

  function handleWhatsAppCheckbox() {
    setWhatsAppInvite((prevState) => !prevState);
  }

  const handleClose = () => {
    onClose(); 
    dialogRef.current?.close(); 
  };

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
    {
      !WhatsAppInvite && setIsLoading(false), onClose();
    }

    return { gameId, formData };
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={handleClose}
      className={classes["modal-dialog"]}
    >
      <GameInvite onClose={onClose} isVisible={isOpen} gameType={gameType} />
    </dialog>
  );
}
