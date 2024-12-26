"use client";

import ModalHeader from "./ModalHeader";
import EmailInvite from "./EmailInvite.jsx";

import classes from "./gameInvite.module.css";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import ModalWhatsappInvite from "./ModalWhatappInvite";

function GameInvite({ onClose, isVisible, gameType }) {
  const [emailGameInvite, setEmailGameInvite] = useState(false);
  const [whatsappGameInvite, setWhatsappGameInvite] = useState(false);

  useEffect(() => {
    if (!isVisible) {
      setEmailGameInvite(false);
    }
  }, [isVisible]);

  // const slideUpAnimation = {
  //   initial: { opacity: 0, y: 50 },
  //   animate: { opacity: 1, y: 0 },
  //   exit: { opacity: 0, y: 50 },
  //   transition: { duration: 0.3, bounce: 0.5 },
  // };

  // const scaleHoverAnimation = {
  //   initial: { scale: 0.5 },
  //   animate: { scale: 1 },
  //   exit: { scale: 0.5 },
  //   whileHover: { scale: 1.3, y: -10 },
  //   transition: { duration: 0.3, type: "spring", stiffness: 300, damping: 10 },
  // };

  function openEmailInvite() {
    setEmailGameInvite(true);
  }

  function closeEmailInvite() {
    setEmailGameInvite(false);
  }

  function openWhatsappInvite() {
    setWhatsappGameInvite(true);
  }

  function closeWhatsappInvite() {
    setWhatsappGameInvite(false);
  }

  return (
    <AnimatePresence mode="wait">
      {isVisible && !emailGameInvite && !whatsappGameInvite && (
        <div className={classes.container}>
          <ModalHeader onClose={onClose} />
          <motion.div key="buttons" className={classes.buttons_container}>
            <motion.div whileHover={{ scale: 1.3, y: -10 }}>
              <Image
                src="/whatsapp_icon_logo.png"
                alt="Whatsapp icon"
                width={63}
                height={63}
                className={classes.whatsapp_icon}
                onClick={openWhatsappInvite}
              />
            </motion.div>

            <motion.div whileHover={{ scale: 1.3, y: -10 }}>
              <Image
                src="/email_icon_logo.png"
                alt="Email icon"
                width={55}
                height={55}
                className={classes.email_icon}
                onClick={openEmailInvite}
              />
            </motion.div>
          </motion.div>
        </div>
      )}

      {emailGameInvite && (
        <motion.div key="emailInvite">
          <EmailInvite
            closeEmailInvite={closeEmailInvite}
            onClose={onClose}
            gameType={gameType}
          />
        </motion.div>
      )}

      {whatsappGameInvite && (
        <motion.div key={"whatsappInvite"}>
          <ModalWhatsappInvite
            closeWhatsappInvite={closeWhatsappInvite}
            onClose={onClose}
            gameType={gameType}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default GameInvite;
