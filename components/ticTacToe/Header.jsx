import './header.css'
import Image from "next/image";

function Header() {
  return (
    <header>
      <Image src={"/tiTacToe-game-logo.png"} alt="game-logo" width={150} height={150} priority />
      <h1> Tic Tac Toe </h1>
    </header>
  );
}

export default Header;
