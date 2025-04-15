"use client";

import Player from "@/components/ticTacToe/Player.jsx";
import GameBoard from "@/components/ticTacToe/GameBoard.jsx";
import Winner from "@/components/Winner";
import Draw from "@/components/Draw";
import Modal from "@/components/Modal/Modal";
import Header from "@/components/ticTacToe/Header";

import Image from "next/image";
import WINNING_COMBINATIONS from "@/winningCombinations/ticTacToc_Combinations";
import classes from "../pageContent.module.css";
import { useState, useEffect } from "react";
import { sendMail } from "../../ticTacToe_server";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { socket } from "../../socket";

const PLAYERS = {
  X: "Player 1",
  O: "Player 2",
};

const initialGameBoard = [
  [null, null, null],
  [null, null, null],
  [null, null, null],
];

let allTimeScore = {
  X: 0,
  draw: 0,
  O: 0,
};

let playerId, playerChallenged;
let emailAdress, gameLinksWithTokens;
function deriveActivePlayer(gameTurns) {
  let currentPlayer;

  if (gameTurns.length % 2 === 0) {
    currentPlayer = "X";
  } else {
    currentPlayer = "O";
  }

  return currentPlayer;
}

function deriveGameTurns(gameTurns) {
  let gameBoard = [...initialGameBoard.map((array) => [...array])];

  for (const turn of gameTurns) {
    const { square, player } = turn;
    if (square && player) {
      const { row, col } = square;
      gameBoard[row][col] = player;
    }
  }
  return gameBoard;
}

function deriveWinner(players, gameBoard) {
  let winner;
  let winnerSymbol;

  for (const combination of WINNING_COMBINATIONS) {
    const firstSquareSymbole =
      gameBoard[combination[0].row][combination[0].column];
    const secondSquareSymbole =
      gameBoard[combination[1].row][combination[1].column];
    const thirdSquareSymbole =
      gameBoard[combination[2].row][combination[2].column];

    if (
      firstSquareSymbole &&
      firstSquareSymbole === secondSquareSymbole &&
      firstSquareSymbole === thirdSquareSymbole
    ) {
      winner = players[firstSquareSymbole];
      winnerSymbol = firstSquareSymbole;
    }
  }
  return winner, winnerSymbol;
}

function Home() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [savedWinner, setSavedWinner] = useState(null);
  const [hasDraw, setHasDraw] = useState(false);
  const [newGameChallenge, setNewGameChallenge] = useState(false);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setModalOpen] = useState(false);

  const { gameId } = useParams();
  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameTurns(gameTurns);
  let winner = deriveWinner(players, gameBoard);
  let namedWinner
  let isDraw = gameTurns.length === 9 && !winner
  if (winner) {
    namedWinner = players[winner];
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("gameToken:" + gameId, token);
    }
  }, [hasDraw, winner]);

  useEffect(() => {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    const decodedToken = jwtDecode(userToken);
    playerId = decodedToken.playedId;

    socket.emit("joinRoom", { gameId });
    socket.emit("initial_GET", { gameId });

    socket.on("initialPageLoad", (data) => {
      if (typeof data === "object") {
        emailAdress = data.emailAdress;
        gameLinksWithTokens = data.gameLinksWithTokens;
        allTimeScore = data.allTimeWinners;
        setPlayers(data.playerNames);
        playerChallenged = data.playerChallenged;
        setCurrentPlayer(data.currentPlayer);
        setSavedWinner(data.winner);
        const derivedGameBoard = data.board;

        if (data.board) {
          const fetchedGameTurns = derivedGameBoard.flatMap((row, rowIndex) =>
            row
              .map((playerSymbol, colIndex) =>
                playerSymbol
                  ? {
                      square: { row: rowIndex, col: colIndex },
                      player: playerSymbol,
                    }
                  : null
              )
              .filter(Boolean)
          );
          setGameTurns(fetchedGameTurns);
        }
      } else {
        playerChallenged = data;
      }

      if (playerChallenged) {
        setNewGameChallenge(true);
      } else {
        setNewGameChallenge(false);
      }
      setIsLoading(false);
    });
    return () => {
      socket.off("initialPageLoad");
    };
  }, [gameId]);

  async function handleActivePlayer(rowIndex, colIndex) {
    const userToken = localStorage.getItem("gameToken:" + gameId);
    const decodedToken = jwtDecode(userToken);
    playerId = decodedToken.playedId;

    if (hasDraw || savedWinner || isLoading) {
      return;
    }

    if (currentPlayer !== playerId) {
      alert("It's not your turn !");
      return;
      // } else if (playerChallenged) {
      //   console.log(playerChallenged, "playerChallenge loop - handleMove Fn");
      //   if (playerChallenged !== playerId) {
      //     alert("It's not your turn !");
      //     console.log("Auth 2 running");
      //     return;
      //   }
    }

    setGameTurns((prevTurns) => {
      let currentPlayer = deriveActivePlayer(prevTurns);
      if (gameTurns.length % 2 === 0) {
        currentPlayer = "X";
      } else {
        currentPlayer = "O";
      }

      let updatedGameBoard = deriveGameTurns(prevTurns);
      updatedGameBoard[rowIndex][colIndex] = currentPlayer;

      if (gameTurns.length === 9 && !winner) {
        setHasDraw(true);
      }

      socket.emit("make-ticTacToe-move", {
        gameId,
        token: userToken,
        board: updatedGameBoard,
        playerNames: players,
        hasDraw: isDraw,
      });

      if (gameTurns.length === 0 && emailAdress.invitingPlayer) {
        sendMail(players, emailAdress, gameLinksWithTokens);
      }
      setIsLoading(false);

      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");

      

      return [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
    });
  }

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleNewGameReq() {
    // let gameType = "ticTacToe";
    playerChallenged = playerId;
    setNewGameChallenge(true);
    socket.emit("startOver_Req", { playerId, gameId });
    // rematchReq(playerId, gameId, gameType);
  }

  async function handleNewGame() {
    socket.emit("startOver", { gameId, players });
    setGameTurns([]);
    setSavedWinner(null);
    setHasDraw(false);
    setNewGameChallenge(false);
  }

  return (
    <div className={classes.header_container}>
      <Header />
      <div className={classes.container}>
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          gameType={"ticTacToe"}
        />
        {winner ? (
          <div className={classes.winner}>
            <Winner
              name={namedWinner}
              player={activePlayer === "O" ? "Player 1" : "Player 2"}
              handleStartGame={handleNewGame}
              newChallengeModal={openModal}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              gameType={"ticTacToe"}
            />
          </div>
        ) : isDraw ? (
          <div className={classes.draw}>
            <Draw
              handleStartGame={handleNewGame}
              newChallengeModal={openModal}
              isModalOpen={isModalOpen}
              closeModal={closeModal}
              gameType={"ticTacToe"}
            />
          </div>
        ) : (
          <div className={classes.board_container}>
            <GameBoard
              selectedPlayer={handleActivePlayer}
              activePlayerSymbol={activePlayer}
              board={gameBoard}
              newGameChallenge={newGameChallenge}
              isGameActive={true}
            />
          </div>
        )}

        <div id={classes.players}>
          <div className={classes.player_container}>
            <Image
              src="/player_X.png"
              alt={"player X token"}
              width={60}
              height={60}
            />
            <div
              className={
                activePlayer === "X"
                  ? classes.playerOne_active
                  : classes.playerOne
              }
            >
              {activePlayer === "X" ? (
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
                    player={"X"}
                    name={players.X}
                    symbol="X"
                    score={allTimeScore.X}
                  />
                </>
              ) : (
                <Player
                  player={"X"}
                  name={players.X}
                  symbol="X"
                  score={allTimeScore.X}
                />
              )}
            </div>
          </div>
          <div className={classes.player_container}>
            <Image
              src="/player_O.png"
              alt={"player O token"}
              width={60}
              height={60}
            />
            <div
              className={
                activePlayer === "O"
                  ? classes.playerTwo_active
                  : classes.playerTwo
              }
            >
              {activePlayer === "O" ? (
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
                    player={"O"}
                    name={players.O}
                    symbol="O"
                    score={allTimeScore.O}
                  />
                </>
              ) : (
                <Player
                  player={"O"}
                  name={players.O}
                  symbol="X"
                  score={allTimeScore.O}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
