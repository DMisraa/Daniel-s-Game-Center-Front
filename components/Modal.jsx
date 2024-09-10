import { useRef, useEffect, useState } from "react";
import classes from "./modal.module.css";
import { gameInvite } from "@/app/server";

export default function Modal({ isOpen, onClose, gameType }) {
  const [isLoading, setIsLoading] = useState(false);
  const dialogRef = useRef(null);
  console.log(isOpen)

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
    };

     await gameInvite(formData, gameType);
     setIsLoading(false)
  }

  return (
    <dialog ref={dialogRef} onClose={handleClose} className={classes["modal-dialog"]}>
      <div className={classes["modal-overlay"]}>
        <div className={classes["modal-content"]}>
          <button className={classes["close-button"]} onClick={onClose}>
            Close
          </button>
          <h2>🎉 Challenge a Friend to an Epic Match! 🚀</h2>
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userEmail">Your Email</label>
              <input type="email" id="userEmail" name="userEmail" required />
            </div>
            <div>
              <label htmlFor="rivalUserEmail">Rival&apos;s Email:</label>
              <input type="email" id="rivalUserEmail" name="rivalUserEmail" required />
            </div>
            <div>
              <label htmlFor="userName">Your Name:</label>
              <input type="text" id="yourName" name="yourName" required />
            </div>
            <div>
              <label htmlFor="rivalName">Rival&apos;s Name:</label>
              <input type="text" id="rivalName" name="rivalName" required />
            </div>
            <button type="submit" disabled={isLoading}>{isLoading ? "Submitting..." : "Submit"}</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
