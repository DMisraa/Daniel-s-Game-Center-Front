import Image from "next/image";
import classes from "./modalEmailInput.module.css";

function ModalEmailInput() {
  return (
    <div className={classes.inputs_wrapper}>
      <div className={classes.names_inputs}>
        <div className={classes.name_input}>
          <Image
            src="/name_input_pic.png"
            alt="name_input_pic"
            width={14}
            height={15}
          />
          <input type="text" placeholder="Full name" name="name" required />
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
      <div className={classes.email_input}>
        <Image
          src="/email_pic.png"
          alt="email small logo"
          width={14}
          height={12}
        />
        <input type="text" placeholder="Email" name="email" required />
      </div>
      <div className={classes.email_input}>
        <Image
          src="/email_pic.png"
          alt="email small logo"
          width={14}
          height={12}
        />
        <input
          type="text"
          placeholder="Friend's Email"
          name="friend_email"
          required
        />
      </div>
    </div>
  );
}

export default ModalEmailInput;
