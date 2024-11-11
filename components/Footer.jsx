import Image from "next/image";
import classes from "./footer.module.css";

function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <>
      <div className={classes.display_container}>
        <div className={classes.logo}>
          <Image
            src="/Game_Center_Logo.png"
            alt="game center logo"
            width={160}
            height={60}
          />
        </div>
        <div className={classes.content}>
          <p>
            Have questions or game ideas? I’d love to hear them! Feel free to
            reach out anytime - let’s make this game center even better together
          </p>
          <div className={classes.contact_wrapper}>
            <div className={classes.contact}>
              <div className={classes.user_contact_input}>
                <Image
                  src="/name_input_pic.png"
                  alt="name_input_pic"
                  width={14}
                  height={15}
                  className={classes.name_icon}
                />
                <input type="text" placeholder="Name" />
                <Image
                  src="/email_pic.png"
                  alt="email small logo"
                  width={14}
                  height={12}
                  className={classes.email_icon}
                />
                <input type="text" placeholder="Email" />
              </div>
              <div className={classes.user_message}>
                <textarea
                  placeholder="Your message.."
                  rows="4"
                  cols="50"
                ></textarea>
              </div>
            </div>
            <div className={classes.submit}>
              <p> Ready to connect? Hit submit! </p>
              <button className={classes.submit_button}> Submit </button>
            </div>
          </div>
        </div>
      </div>
      <footer className={classes.rights}>
      <p>@{currentYear} Daniel&apos;s Game Center. All rights reserved.</p>
      </footer>
    </>
  );
}

export default Footer;
