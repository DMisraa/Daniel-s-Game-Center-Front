import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <div className="home_content">
      <div className="home_page_logo">
        <Image
          src="/Game_Center_Home.png"
          alt="Home page logo"
          layout="responsive"
          width={1400}
          height={440}
        />
      </div>
      <div className="game_links">
        <p> Choose a game to play !</p>
        <div className="game_logos">
          <Link href="/ticTacToe">
            <Image
              src="/TicTacToe_logo.png"
              alt="Tic Tac Toe game logo"
              width={300}
              height={300}
            />
          </Link>
          <Link href="/connectFour">
            <Image
              src="/4_InARaw_logo.png"
              alt="4 in a raw game logo"
              width={300}
              height={300}
            />
          </Link>
          <Link href="/chess">
            <Image
              src="/Chess_logo.png"
              alt="Chess game logo"
              width={300}
              height={300}
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
