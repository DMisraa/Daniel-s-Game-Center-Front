'use client'

import classes from './pageContent.module.css'
import { useEffect, useState } from "react";
import GameBoard from '../../components/GameBoard'
import Player from '../../components/Player'
import winningCombinations from '../../WINNING_COMBINATIONS'

const initialBoard = Array.from({ length: 6 }, () => Array(7).fill(null));

const PLAYERS = {
  red: "Red Player",
  yellow: "Yellow Player",
};

let turnsLength = 0;

export default function PageContent() {
  const [startGame, setStartGame] = useState(false)
  const [redPlayerName, setRedPlayerName] = useState(PLAYERS.red);
  const [yellowPlayerName, setYellowPlayerName] = useState(PLAYERS.yellow);
  const [isRedEditing, setIsRedEditing] = useState(false);
  const [isYellowEditing, setIsYellowEditing] = useState(false);

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState('');
  const [winner, setWinner] = useState(null);
  const [hasDraw, setHasDraw] = useState(false);


  useEffect(() => {
    try {
        const response = fetch('http://localhost:4000/gameboard')
    } catch (error) {
        console.log('error fetching the gameboard' , error)

    }
    
  }, [])

  function handleRedChange(event) {
    setRedPlayerName(event.target.value);
  }

  function handleYellowChange(event) {
    setYellowPlayerName(event.target.value);
  }

  function handleRedEditClick() {
    setIsRedEditing((editing) => !editing);
  }

  function handleYellowEditClick() {
    setIsYellowEditing((editing) => !editing);
  }

  function handleStartGame() {
   setStartGame(true)
   setCurrentPlayer('red')
  }

  async function handleMove(column) {
    if (winner || hasDraw) return;
    if (board[0][column]) return;

    turnsLength++;

    if (turnsLength === 42 && !winner) {
      setHasDraw(true);
    }

    const newBoard = board.map((row) => [...row]);
    for (let i = board.length - 1; i >= 0; i--) {
      if (!newBoard[i][column]) {
        newBoard[i][column] = currentPlayer;
        break;
      }
    }
    setBoard(newBoard);
    const winningPlayer = checkForWinner(newBoard);
    if (winningPlayer) {
      setWinner(winningPlayer);
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");
    }

    try {
        const response = await fetch('http://localhost:4000/move', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ column: parseInt(column) })
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Error making a move:', error);
            return;
        }

    } catch (error) {
        console.error('Error making a move:', error);
    }

  }

  async function handleNewGame() {
    setBoard(initialBoard);
    setWinner(null);
    turnsLength = 0;
    setHasDraw(false);
   
//     try {
//         const response = await fetch('http://localhost:4000/gameboard', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json',
//             },
//         });
//         console.log(response)
        
//       } catch (error) {
//         console.error('Error starting a new game:', error);
//       }
  }

  function checkForWinner(board) {
    for (const combination of winningCombinations) {
      const [a, b, c, d] = combination;
      const player = board[a.row][a.column];
      if (
        player &&
        player === board[b.row][b.column] &&
        player === board[c.row][c.column] &&
        player === board[d.row][d.column]
      ) {
        let winningPlayer;
        if (player === "red") {
          winningPlayer = redPlayerName;
          return winningPlayer;
        } else if (player === "yellow") {
          winningPlayer = yellowPlayerName;
          return winningPlayer;
        }
      }
    }
    return null; 
  }

  return (
    <>
      <ol id={classes.players} className={classes['highlight-player']}>
        <Player
          name={redPlayerName}
          isEditing={isRedEditing}
          handlePlayerName={handleRedChange}
          handleEdit={handleRedEditClick}
          isRedActive={currentPlayer === "red"}
        />
        <Player
          name={yellowPlayerName}
          isEditing={isYellowEditing}
          handlePlayerName={handleYellowChange}
          handleEdit={handleYellowEditClick}
          isYellowActive={currentPlayer === "yellow"}
        />
      </ol>
      <div className={classes.container} > 
      {!startGame && <button onClick={handleStartGame} className={classes['start-game-button']} > Start Game ! </button> }</div>
      {startGame && <GameBoard
        yellowPlayer={yellowPlayerName}
        redPlayer={redPlayerName}
        winner={winner}
        handleNewGame={handleNewGame}
        handleMove={handleMove}
        hasDraw={hasDraw}
        board={board}
      />}
      
    </>
  );
}
