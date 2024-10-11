"use client";

import classes from "../pageContent.module.css";
import { useState, useEffect } from "react";
import {
  updateBoard,
  fetchData,
  OnlineMatchStartOver,
  sendMail,
} from "../../ticTacToe_server";
import Player from "@/components/ticTacToe/Player.jsx";
import GameOver from "@/components/ticTacToe/GameOver.jsx";
import GameBoard from "@/components/ticTacToe/GameBoard.jsx";
import WINNING_COMBINATIONS from "@/winningCombinations/ticTacToc_Combinations";
import AllTimeScore from "@/components/AllTimeScore";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { rematchReq } from "@/app/server";
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
    console.log("main useEffect", decodedToken);
    playerId = decodedToken.playedId;

    socket.emit("joinRoom", { gameId });
    socket.emit("initial_GET", { gameId });

    socket.on("initialPageLoad", (data) => {
      
      if (typeof data === 'object') {
        console.log("socket initial req RUNNING, dara:", data);
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
        if (playerChallenged) {
          console.log(playerChallenged, "newGameChallenge set TRUE, useEffect1");
          setNewGameChallenge(true);
        }
      } else {
        console.log(data, "newGameChallenge Socket useEffect RUNNING");
        playerChallenged = data
      }

      
      if (playerChallenged) {
        console.log(playerChallenged, "newGameChallenge set TRUE, useEffect2");
        setNewGameChallenge(true);
      }
    });

    //   async function getData() {
    //   const data = await fetchData(gameId);
    //     console.log("GET ROUTE RUNNING");
    //     localStorage.getItem("gameToken:" + gameId);
    //     userToken = localStorage.getItem("gameToken:" + gameId);
    //     const decodedToken = jwtDecode(userToken);
    //     console.log(decodedToken, "decoded Token");
    //     playerId = decodedToken.playedId;
    //     console.log(playerId, "playerId useEffect hook");

    //     emailAdress = data.emailAdress;
    //     gameLinksWithTokens = data.gameLinksWithTokens;
    //     allTimeScore = data.allTimeWinners;
    //     setPlayers(data.playerNames);
    //     playerChallenged = data.playerChallenged;
    //     setCurrentPlayer(data.currentPlayer);
    //     setHasDraw(data.hasDraw);
    //     setSavedWinner(data.winner);
    //     const derivedGameBoard = data.board;
    //     const fetchedGameTurns = derivedGameBoard.flatMap((row, rowIndex) =>
    //       row
    //         .map((playerSymbol, colIndex) =>
    //           playerSymbol
    //             ? {
    //                 square: { row: rowIndex, col: colIndex },
    //                 player: playerSymbol,
    //               }
    //             : null
    //         )
    //         .filter(Boolean)
    //     );
    //     setGameTurns(fetchedGameTurns);
    // }

    // if (userToken === undefined) {
    //    getData();
    // }

    setIsLoading(false);
  }, [gameId]);

  async function handleActivePlayer(rowIndex, colIndex) {
    const userToken = localStorage.getItem("gameToken:" + gameId);
    console.log(userToken, "userToken");

    if (currentPlayer !== playerId) {
      alert("It's not your turn !");
      console.log("Auth 1 running");
      return;
    } else if (playerChallenged) {
      console.log(playerChallenged, "playerChallenge loop - handleMove Fn");
      if (playerChallenged !== playerId) {
        alert("It's not your turn !");
        console.log("Auth 2 running");
        return;
      }
    }
    if (hasDraw || savedWinner || isLoading) {
      return;
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
      console.log(
        players,
        emailAdress,
        gameLinksWithTokens,
        "data sent to sendMail Fn"
      );

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
    <main>
      <h1>Welcome to game {gameId}!</h1>
      <div id={classes["game-container"]}>
        <ol id={classes.players}>
          <Player name={players.X} symbol="X" isActive={activePlayer === "X"} />
          <Player name={players.O} symbol="O" isActive={activePlayer === "O"} />
        </ol>
        {(savedWinner || hasDraw) && (
          <GameOver
            winner={savedWinner}
            newGame={handleNewGameReq}
            playerId={playerId}
            playerChallenged={playerChallenged}
            newGameChallenge={newGameChallenge}
            handleNewGame={handleNewGame}
          />
        )}
        <GameBoard
          selectedPlayer={handleActivePlayer}
          activePlayerSymbol={activePlayer}
          board={gameBoard}
          newGameChallenge={newGameChallenge}
        />
      </div>
      <AllTimeScore
        playerOne={"X"}
        playerTwo={"O"}
        allTimeGameScorePlayerOne={allTimeScore.X}
        allTimeGameScorePlayerTwo={allTimeScore.O}
        allTimeGameScoreDraw={allTimeScore.draw}
      />
    </main>
  );
}

export default Home;
