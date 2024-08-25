import classes from './header.module.css'
import Image from "next/image";

function Header() {
  return (
    <header id='header' >
      <Image src={"/tiTacToe-game-logo.png"} alt="game-logo" width={150} height={150} priority />
      <h1 id='headline' > Tic Tac Toe </h1>
    </header>
  );
}

export default Header;
