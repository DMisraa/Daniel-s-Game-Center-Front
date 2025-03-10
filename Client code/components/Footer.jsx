"use client";

import Image from "next/image";
import classes from "./footer.module.css";
import { handleFooterFormSubmit } from "@/app/server";

import { useState } from "react";

function Footer() {
  const [isLoading, setIsLoading] = useState(false);

  const currentYear = new Date().getFullYear();

  async function onSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = {
      name: event.target.name.value,
      email: event.target.email.value,
      message: event.target.message.value,
    };
    await handleFooterFormSubmit(formData);

    event.target.reset();
    setIsLoading(false);
  }

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
          <form onSubmit={onSubmit}>
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
                  <input type="text" placeholder="Name" name="name" required />
                  <Image
                    src="/email_pic.png"
                    alt="email small logo"
                    width={14}
                    height={12}
                    className={classes.email_icon}
                  />
                  <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    required
                  />
                </div>
                <div className={classes.user_message}>
                  <textarea
                    placeholder="Your message.."
                    rows="4"
                    cols="50"
                    name="message"
                    required
                  ></textarea>
                </div>
              </div>
              <div
                className={classes.submit}
                style={isLoading ? { width: "126%" } : {}}
              >
                <p> Ready to connect? Hit submit! </p>
                <button
                  style={isLoading ? { transform: "translateX(10%)" } : {}}
                  disabled={isLoading}
                >
                  {isLoading ? "Submmiting.." : "Submit"}
                </button>
              </div>
            </div>
          </form>
        </div>
      
      </div>
      <footer className={classes.rights}>
      <p>@{currentYear} Daniel&apos;s Game Center. All rights reserved.</p>
    </footer>
    </>
  );
}

export default Footer;
