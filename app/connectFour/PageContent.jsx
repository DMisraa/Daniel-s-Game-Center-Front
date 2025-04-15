"use client";

import GameBoard from "../../components/connect4/GameBoard";
import Modal from "@/components/Modal/Modal";
import Winner from "@/components/Winner";
import Draw from "@/components/Draw";
import Player from "../../components/connect4/Player";

import winningCombinations from "../../winningCombinations/WINNING_COMBINATIONS";
import { useEffect, useRef, useState } from "react";
import { fetchData, updateBoard, fetchPlayerName } from "../server";
import classes from "./pageContent.module.css";
import Image from "next/image";

export const initialBoard = Array.from({ length: 6 }, () =>
  Array(7).fill(null)
);

const PLAYERS = {
  red: "Red Player",
  blue: "Blue Player",
};

let turnsLength = 0;

let allTimeScoreBoard = {
  yellowPlayer: 0,
  redPlayer: 0,
  draw: 0,
};

export default function PageContent() {
  const [startGame, setStartGame] = useState(false);
  const [redPlayerName, setRedPlayerName] = useState(PLAYERS.red);
  const [yellowPlayerName, setYellowPlayerName] = useState(PLAYERS.blue);
  const [isRedEditing, setIsRedEditing] = useState(false);
  const [isYellowEditing, setIsYellowEditing] = useState(false);

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [winner, setWinner] = useState(null);
  const [hasDraw, setHasDraw] = useState(false);
  const [allTimeGameScore, setAllTimeGameScore] = useState(allTimeScoreBoard);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const player = useRef({
    redPlayer: redPlayerName,
    bluePlayer: yellowPlayerName,
  });

  const timeoutRef = useRef(null);

  useEffect(() => {
  
    timeoutRef.current = setTimeout(() => {
      console.log("10 minutes passed without a move, resetting board");
      setBoard(initialBoard);
      setRedPlayerName(PLAYERS.red)
      setYellowPlayerName(PLAYERS.blue)
    }, 10 * 60 * 1000);
  
    return () => {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    };
  }, [board, winner, hasDraw]);

  useEffect(() => {
    async function getData() {
      try {
        console.log("NEXT_PUBLIC_BASE_URL:", process.env.NEXT_PUBLIC_BASE_URL);
        const data = await fetchData();
        if (data) {
          turnsLength = data.turnLength;
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
      } catch (error) {
        console.log("error fetching the gameboard", error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
    return () => {};
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
    if (winner || hasDraw || isLoading) return;
    if (board[0][column]) return;
    turnsLength++;
    console.log("turnLength:", turnsLength);

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
      setWinner(winningPlayer);
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "blue" : "red");
    }

    await updateBoard(column);
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
        } else if (player === "blue") {
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
    <div className={classes.gameboard_container}>
      <>
        {winner ? (
          <div className={classes.winner}>
            <Winner
              name={winner}
              player={currentPlayer === "blue" ? "Player 1" : "Player 2"}
              handleStartGame={handleNewGame}
              newChallengeModal={openModal}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              gameType={"connectFour"}
            />
          </div>
        ) : hasDraw ? (
          <div className={classes.draw}>
            <Draw
              handleStartGame={handleNewGame}
              newChallengeModal={openModal}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              gameType={"connectFour"}
            />
          </div>
        ) : (
          <>
            <GameBoard
              winner={winner}
              handleNewGameReq={handleNewGame}
              handleMove={handleMove}
              hasDraw={hasDraw}
              board={board}
              isGameActive={startGame}
            />
            {!startGame && (
              <div className={classes.buttons_container}>
                <button
                  className={classes["start-game-button"]}
                  onClick={handleStartGame}
                >
                  Start to play !
                </button>
                <button
                  className={classes["challenge-friend"]}
                  onClick={openModal}
                >
                  Challenge A Friend !
                </button>
              </div>
            )}
            <Modal
              isOpen={isModalOpen}
              onClose={closeModal}
              gameType={"connectFour"}
            />
          </>
        )}

        <div id={classes.players}>
          <div className={classes.player_container}>
            {startGame && (
              <Image
                src="/red_token.png"
                alt={"red player token"}
                width={60}
                height={60}
                className={classes.active_image}
              />
            )}
            <div
              className={
                startGame && !winner && !hasDraw && currentPlayer === "red"
                  ? classes.playerOne_active
                  : classes.playerOne
              }
            >
              {startGame && !winner && !hasDraw && currentPlayer === "red" ? (
                <>
                  <div className={classes.active_player_box}>
                    <p>It&apos;s your move!</p>
                    <Image
                      src="/small_star.png"
                      alt={"small star"}
                      width={20}
                      height={18}
                    />
                  </div>
                  <Player
                    player={"Player 1"}
                    name={redPlayerName}
                    isEditing={isRedEditing}
                    handlePlayerName={handleRedChange}
                    handleEdit={handleRedEditClick}
                    ref={player}
                    score={allTimeGameScore.redPlayer}
                  />
                </>
              ) : (
                <Player
                  player={"Player 1"}
                  name={redPlayerName}
                  isEditing={isRedEditing}
                  handlePlayerName={handleRedChange}
                  handleEdit={handleRedEditClick}
                  ref={player}
                  score={allTimeGameScore.redPlayer}
                />
              )}
            </div>
          </div>

          <div className={classes.player_container}>
            {startGame && (
              <Image
                src="/blue_token.png"
                alt={"blue player token"}
                width={60}
                height={60}
                 className={classes.active_image}
              />
            )}
            <div
              className={
                startGame && !winner && !hasDraw && currentPlayer === "blue"
                  ? classes.playerTwo_active
                  : classes.playerTwo
              }
            >
              {startGame &&!winner && !hasDraw && currentPlayer === "blue" ? (
                <>
                  <div className={classes.active_player_box}>
                    <p>It&apos;s your move!</p>
                    <Image
                      src="/small_star.png"
                      alt={"small star"}
                      width={20}
                      height={18}
                    />
                  </div>
                  <Player
                    player={"Player 2"}
                    name={yellowPlayerName}
                    isEditing={isYellowEditing}
                    handlePlayerName={handleYellowChange}
                    handleEdit={handleYellowEditClick}
                    ref={player}
                    score={allTimeGameScore.yellowPlayer}
                  />
                </>
              ) : (
                <Player
                  player={"Player 2"}
                  name={yellowPlayerName}
                  isEditing={isYellowEditing}
                  handlePlayerName={handleYellowChange}
                  handleEdit={handleYellowEditClick}
                  ref={player}
                  score={allTimeGameScore.yellowPlayer}
                />
              )}
            </div>
          </div>
        </div>
      </>
    </div>
  );
}

