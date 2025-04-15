import Image from "next/image";
import classes from './header.module.css'

function Header() {
  return (
    <div className={classes.header_container}>
      <Image src="/TicTacToe_page_logo.png" alt="Tic Tac Toe game-logo" width={570} height={160} />
    </div>
  );
}

export default Header;
