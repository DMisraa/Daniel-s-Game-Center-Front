import GameInvite from "./GameInvite.jsx";

import { useRef, useEffect } from "react";
import classes from "./modal.module.css";



export default function Modal({ isOpen, onClose, gameType }) {
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
