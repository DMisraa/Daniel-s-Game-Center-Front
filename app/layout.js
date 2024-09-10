import Link from "next/link";
import React from "react";
import "./globals.css";

export const metadata = {
  title: 'Game Center',
  description: 'Daniel&apos;s game center'
}
export default function RootLayout({ children }) {
  return (
    
    <html lang="en">
     
      <body>
        <div className="navbar">
          <Link href="/">Home</Link>
          <Link href="/connectFour">ConnectFour</Link>
          <Link href="/ticTacToe">Tic Tac Toe</Link>
          <Link href="/chess">Chess</Link>
          <Link href="/about">About</Link>
        </div>
        <div className="page-content">{children}</div>
      </body>
    </html>
  );
}

