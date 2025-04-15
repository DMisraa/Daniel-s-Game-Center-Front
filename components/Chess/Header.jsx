import Image from "next/image";
import classes from "./header.module.css";

function Header() {
  return (
    <div className={classes.header_container}>
    <Image src='/chess_page_logo.png' alt="4 In A Raw page_logo" width={620} height={160} />
    </div>
  );
}

export default Header;