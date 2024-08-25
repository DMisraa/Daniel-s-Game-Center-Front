import { useRef, useEffect } from "react";
import classes from "./modal.module.css";

export default function Modal({ isOpen, onClose }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;

    if (isOpen && dialog) {
      dialog.showModal();
    } else if (dialog) {
      dialog.close();
    }
  }, [isOpen]);

  function handleClose() {
    onClose();
  }

  return (
    <dialog ref={dialogRef} onClose={handleClose}>
      <div className={classes["modal-overlay"]}>
        <div className={classes["modal-content"]}>
          <button className={classes["close-button"]} onClick={onClose}>
            Close
          </button>
          <h2>🎉 Challenge a Friend to an Epic Match! 🚀</h2>
          <form>
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
              <label htmlFor="yourName">Your Name:</label>
              <input type="text" id="yourName" name="yourName" required />
            </div>
            <div>
              <label htmlFor="rivalName">Rival&apos;s Name:</label>
              <input type="text" id="rivalName" name="rivalName" required />
            </div>
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </dialog>
  );
}
