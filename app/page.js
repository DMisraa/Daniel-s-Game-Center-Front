import Link from "next/link";

export default function Home() {
  return (
    <div className="home-content">
      <h1>Welcome to Daniel&apos;s Game Center!</h1>
      <p>Choose a game to play:</p>
      <div className="game-buttons">
        <Link className="game-button" href="/connectFour">
         Connect 4
        </Link>
        <Link className="game-button" href="/ticTacToe">
          Tic Tac Toe
        </Link>
        <Link className="game-button" href="/chess">
        Chess
        </Link>
      </div>
    </div>
  );
}
