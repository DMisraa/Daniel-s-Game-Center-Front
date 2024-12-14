import Image from "next/image";
import "./header.css";

function Header() {
  return (
    <div className="header-container">
    <Image src='/4InARaw_page_logo.png' alt="4 In A Raw page_logo" width={540} height={180} />
    </div>
  );
}

export default Header;
