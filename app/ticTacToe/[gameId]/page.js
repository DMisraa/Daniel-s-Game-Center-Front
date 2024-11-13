"use client";

import Player from "@/components/ticTacToe/Player.jsx";
import GameOver from "@/components/ticTacToe/GameOver.jsx";
import GameBoard from "@/components/ticTacToe/GameBoard.jsx";
import Winner from "@/components/Winner";
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

  const { gameId } = useParams();
  console.log(gameId, "gameID");
  console.log('playerNames: ' + players)

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameTurns(gameTurns);

  let winner = deriveWinner(players, gameBoard);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (gameTurns.length === 9 && !winner) {
      setHasDraw(true);
    }

    if (activePlayer === "X" && winner) {
      /////// Do i need this code if I work with WebSocket ?
      allTimeScore.O++;
      setSavedWinner(players.O);
    } else if (activePlayer === "O" && winner) {
      allTimeScore.X++;
      setSavedWinner(players.X);
    } else if (hasDraw) {
      allTimeScore.draw++;
    }

    if (token) {
      localStorage.setItem("gameToken:" + gameId, token);
    }
    console.log(process.env.NEXT_PUBLIC_WS_URL, "socket Url");
  }, [hasDraw, winner]);

  useEffect(() => {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    const decodedToken = jwtDecode(userToken);
    console.log("main useEffect decoded token:", decodedToken);
    playerId = decodedToken.playedId;

    socket.emit("joinRoom", { gameId });
    socket.emit("initial_GET", { gameId });

    socket.on("initialPageLoad", (data) => {
      if (typeof data === "object") {
        console.log("socket initial req RUNNING, data:", data);
        emailAdress = data.emailAdress;
        gameLinksWithTokens = data.gameLinksWithTokens;
        allTimeScore = data.allTimeWinners;
        setPlayers(data.playerNames);
        playerChallenged = data.playerChallenged;
        setCurrentPlayer(data.currentPlayer);
        setHasDraw(data.hasDraw);
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
        console.log(
          "newGameChallenge Socket useEffect RUNNING, playerChallenged:",
          data
        );
        playerChallenged = data;
      }

      if (playerChallenged) {
        console.log(playerChallenged, "newGameChallenge set TRUE, useEffect2");
        setNewGameChallenge(true);
      } else {
        console.log(playerChallenged, "newGameChallenge set false");
        setNewGameChallenge(false);
      }
    });
    setIsLoading(false);
  }, [gameId]);

  async function handleActivePlayer(rowIndex, colIndex) {
    const userToken = localStorage.getItem("gameToken:" + gameId);
    console.log(userToken, "userToken");
    const decodedToken = jwtDecode(userToken);
    console.log("handleActivePlayer Fn decoded token:", decodedToken);
    playerId = decodedToken.playedId;
    console.log("playerId:", playerId);

    if (hasDraw || savedWinner || isLoading) {
      return;
    }

    if (currentPlayer !== playerId) {
      alert("It's not your turn !");
      console.log("Auth 1 running");
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

      socket.emit("make-ticTacToe-move", {
        gameId,
        token: userToken,
        board: updatedGameBoard,
        playerNames: players,
      });

      if (gameTurns.length === 0) {
        sendMail(players, emailAdress, gameLinksWithTokens);
      }

      // updateBoard(updatedGameBoard, gameId, players);
      setIsLoading(false);

      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");

      return [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
    });
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
    // await OnlineMatchStartOver(gameId, players);
    setGameTurns([]);
    setSavedWinner(null);
    setCurrentPlayer("X");
    setHasDraw(false);
    setNewGameChallenge(false);
  }

  return (
    <>
      <div className={classes.container}>
        {winner || hasDraw ? (
          <div className={classes.game_outcome}>
            <Winner
              name={winner}
              player={activePlayer === "O" ? "Player 1" : "Player 2"}
              handleStartGame={handleNewGame}
            />
          </div>
        ) : (
          <div className={classes.board_container}>
            <GameBoard
              selectedPlayer={handleActivePlayer}
              activePlayerSymbol={activePlayer}
              board={gameBoard}
              newGameChallenge={newGameChallenge}
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

            <div className={classes.playerOne}>
              <Player
                player={"Player 1"}
                name={players.X}
                symbol="X"
                isActive={activePlayer === "X"} 
              />
            </div>
          </div>
          <div className={classes.player_container}>
            <Image
              src="/player_O.png"
              alt={"player O token"}
              width={60}
              height={60}
            />
            <div className={classes.playerTwo}>
              <Player
                player={"Player 2"}
                name={players.O}
                symbol="O"
                isActive={activePlayer === "O"}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
