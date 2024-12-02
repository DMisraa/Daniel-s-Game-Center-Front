import Image from 'next/image'
import classes from './nameInputs.module.css'

function NameInputs() {
    return (
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
    )
}

export default NameInputs