import Link from "next/link";
import React from "react";
import Image from "next/image";
import "./globals.css";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Game Center",
  description: "Daniel's game center",
};
  export default function RootLayout({ children }) {
    return (
      <html lang="en">
        <body>
        <div className="home_content">
          <div className="navbar">
              <Image
                src="/Game_Center_Logo.png"
                alt="game center logo"
                width={160}
                height={60}
              />
            <div className="navbar_links">
              <Link href="/">Home</Link>
              <Link href="/about">About</Link>
              <Link href="/ticTacToe">Tic Tac Toe</Link>
              <Link href="/connectFour">4 In A Raw</Link>
              <Link href="/chess">Chess</Link>
              <button> Subscribe </button>
            </div>
          </div>
          <div className="page-content">{children}</div>
          <Footer />
          </div>
        </body>
       
      </html>
    );
  }
