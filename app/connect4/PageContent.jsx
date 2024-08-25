"use client";

import { useEffect, useRef, useState } from "react";

import { fetchData, updateBoard, fetchPlayerName } from "../server";
import classes from "./pageContent.module.css";
import GameBoard from "../../components/connect4/GameBoard";
import Modal from "@/components/Modal";
import Player from "../../components/connect4/Player";
import winningCombinations from "../../winningCombinations/WINNING_COMBINATIONS";
import AllTimeScore from "@/components/AllTimeScore";

export const initialBoard = Array.from({ length: 6 }, () =>
  Array(7).fill(null)
);

const PLAYERS = {
  red: "Red Player",
  yellow: "Yellow Player",
};

let turnsLength = 0;

export default function PageContent() {
  const [startGame, setStartGame] = useState(false);
  const [redPlayerName, setRedPlayerName] = useState(PLAYERS.red);
  const [yellowPlayerName, setYellowPlayerName] = useState(PLAYERS.yellow);
  const [isRedEditing, setIsRedEditing] = useState(false);
  const [isYellowEditing, setIsYellowEditing] = useState(false);

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [winner, setWinner] = useState(null);
  const [hasDraw, setHasDraw] = useState(false);
  const [allTimeGameScore, setAllTimeGameScore] = useState({});
  const [isModalOpen, setModalOpen] = useState(false);

  const player = useRef({
    redPlayer: redPlayerName,
    yellowPlayer: yellowPlayerName,
  });

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData();
        if (data) {
          setBoard(data.board);
          setCurrentPlayer(data.currentPlayer);
          setWinner(data.winner);
          setHasDraw(data.hasDraw);
          setAllTimeGameScore(data.allTimeWinners);
          setRedPlayerName(data.playerNames.redPlayer);
          setYellowPlayerName(data.playerNames.yellowPlayer);
        } else {
          return;
        }

        if (data.board.some((row) => row.some((cell) => cell !== null))) {
          setStartGame(true);
        }
        if (winner || hasDraw) {
          setWinner(null);
          setHasDraw(false);
          setBoard(initialBoard);
        }
        console.log("Component mounted");
      } catch (error) {
        console.log("error fetching the gameboard", error);
      }
    }

    getData();
    return () => {
      console.log("Component unmounted");
    };
  }, []);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }
  

  function handleRedChange(event) {
    const value = event.target.value;
    setRedPlayerName(value);
    player.current.redPlayer = value;
  }

  function handleYellowChange(event) {
    const value = event.target.value;
    setYellowPlayerName(value);
    player.current.yellowPlayer = value;
  }

  function handleRedEditClick() {
    setIsRedEditing((editing) => !editing);
    if (isRedEditing) {
      const updatedPlayersName = {
        yellowPlayer: yellowPlayerName,
        redPlayer: player.current.redPlayer,
      };

      fetchPlayerName(updatedPlayersName);
    }
  }

  function handleYellowEditClick() {
    setIsYellowEditing((editing) => !editing);
    if (isYellowEditing) {
      const updatedPlayersName = {
        yellowPlayer: player.current.yellowPlayer,
        redPlayer: redPlayerName,
      };

      fetchPlayerName(updatedPlayersName);
    }
  }

  async function handleStartGame() {
    setStartGame(true);
    setWinner(null);
    turnsLength = 0;
    setHasDraw(false);
    if (currentPlayer === "") {
      setCurrentPlayer("red");
    }
  }

  function handleNewGame() {
    setBoard(initialBoard);
    setWinner(null);
    turnsLength = 0;
    setHasDraw(false);
  }

  async function handleMove(column) {
    if (winner || hasDraw) return;
    if (board[0][column]) return;

    turnsLength++;

    if (turnsLength === 42 && !winner) {
      setAllTimeGameScore((prevState) => ({
        ...prevState,
        draw: allTimeGameScore.draw + 1,
      }));
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
      turnsLength = 0;
      console.log(currentPlayer, "Winning player - handleMove Fn");
      setWinner(winningPlayer);
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");
    }

    updateBoard(column);
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
          setAllTimeGameScore((prevState) => ({
            ...prevState,
            redPlayer: allTimeGameScore.redPlayer + 1,
          }));
          winningPlayer = redPlayerName;
          return winningPlayer;
        } else if (player === "yellow") {
          setAllTimeGameScore((prevState) => ({
            ...prevState,
            yellowPlayer: allTimeGameScore.yellowPlayer + 1,
          }));
          winningPlayer = yellowPlayerName;
          return winningPlayer;
        }
      }
    }
    return null;
  }

  return (
    <>
      <ol id={classes.players} className={classes["highlight-player"]}>
        <Player
          name={redPlayerName}
          isEditing={isRedEditing}
          handlePlayerName={handleRedChange}
          handleEdit={handleRedEditClick}
          isRedActive={startGame && currentPlayer === "red"}
          ref={player}
        />
        <Player
          name={yellowPlayerName}
          isEditing={isYellowEditing}
          handlePlayerName={handleYellowChange}
          handleEdit={handleYellowEditClick}
          isYellowActive={startGame && currentPlayer === "yellow"}
          ref={player}
        />
      </ol>
      <div className={classes.container}>
        {!startGame && ( 
          <>
          <button
            onClick={handleStartGame}
            className={classes["start-game-button"]}
          >
            Start Game !
          </button>
          <button className={classes['challenge-friend']} onClick={openModal} > Challenge A Friend ! </button>
          <Modal isOpen={isModalOpen} onClose={closeModal} />
          </>
        )}
      </div>
      {startGame && (
        <GameBoard
          yellowPlayer={yellowPlayerName}
          redPlayer={redPlayerName}
          winner={winner}
          handleNewGame={handleNewGame}
          handleMove={handleMove}
          hasDraw={hasDraw}
          board={board}
        />
      )}
      <AllTimeScore
        allTimeGameScoreDraw={allTimeGameScore.draw}
        allTimeGameScorePlayerOne={allTimeGameScore.redPlayer}
        allTimeGameScorePlayerTwo={allTimeGameScore.yellowPlayer}
        playerOne={'Red Player'}
        playerTwo={'Yellow Player'}
      />
    </>
  );
}
