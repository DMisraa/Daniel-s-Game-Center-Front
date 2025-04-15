import classes from './modalButton.module.css'

function ModalButton({ text, closeModal }) {
    return (
        <div className={classes.button_wrapper}>
        <button onClick={closeModal}> {text} </button>
        </div>
    )
}

export default ModalButton

