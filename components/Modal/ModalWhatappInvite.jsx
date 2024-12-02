import Dropdown from "./Components/DropDown";
import NavigationButtons from "./Components/NavigationButtons";
import ModalButton from "./ModalButton";
import ModalHeader from "./ModalHeader";
import ModalClosePage from "./ModalClosePage";

import Image from "next/image";
import classes from "./modalWhatsappInvite.module.css";
import { useState } from "react";

function ModalWhatsappInvite({ closeWhatsappInvite, onClose, gameType }) {
  const [isClosePage, setIsClosePage] = useState(false);
  const [value, setValue] = useState("050");
  const [formData, setFormData] = useState(null);

  const options = ["050", "051", "052", "053", "054", "055", "058"];

  function handleChange(event) {
    setValue(event.target.value);
  }

  function onClosePage(event) {
    event.preventDefault();

    let newValue = value.substring(1);
    let regionalNumber = "+972";

    const formData = {
      phoneNumber: regionalNumber + newValue + event.target.friend_number.value,
      userName: event.target.name.value,
      rivalName: event.target.friend_name.value,
    };
    setIsClosePage(true);
    setFormData(formData);
  }

  function closeModal() {
    closeWhatsappInvite();
    onClose();
  }

  return (
    <>
      
        {!isClosePage && (
            <div className={classes.container}>
            <div className={classes.button_container}>
              <NavigationButtons
                closeEmailInvite={closeWhatsappInvite}
                closeModal={onClose}
              />
            </div>
            <ModalHeader gameInviteOff={true} />
            <form onSubmit={onClosePage}>
              <div className={classes.inputs_wrapper}>
                <div className={classes.names_inputs}>
                  <div className={classes.name_input}>
                    <Image
                      src="/name_input_pic.png"
                      alt="name_input_pic"
                      width={14}
                      height={15}
                    />
                    <input
                      type="text"
                      placeholder="Full name"
                      name="name"
                      required
                    />
                  </div>
                  <div className={classes.rivalName_input}>
                    <Image
                      src="/name_input_pic.png"
                      alt="name_input_pic"
                      width={14}
                      height={15}
                    />
                    <input
                      type="text"
                      placeholder="Friend's name"
                      name="friend_name"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={classes.input_container}>
                <Dropdown
                  value={value}
                  options={options}
                  handleChange={handleChange}
                />
                <input
                  type="number"
                  placeholder="000-0000"
                  name="friend_number"
                  required
                />
              </div>
              <div className={classes.submit_button}>
                <ModalButton text={"Lets go!"} />
              </div>
            </form>
            </div>
          
        )}
      
     
        {isClosePage && (
            <div className={classes.closePage_container}>
          <ModalClosePage
            gameType={gameType}
            formData={formData}
            closeModal={closeModal}
            whatsappInvite={true}
            mainText={'Almost done!'}
            secondaryText={'Hit close to be redirected to WhatsApp with a game invite'}
            gamelinkText={"Come back to this page to start the game"}
          />
          </div>
        )}
      
    </>
  );
}

export default ModalWhatsappInvite;
