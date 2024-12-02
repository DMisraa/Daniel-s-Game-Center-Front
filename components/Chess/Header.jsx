import Image from "next/image";
import "../ticTacToe/header.module.css";

function Header() {
  return (
    <div className="header-container">
    <Image src='/chess_page_logo.png' alt="4 In A Raw page_logo" width={620} height={160} style={{ transform: "translateX(80px)" }} />
    </div>
  );
}

export default Header;