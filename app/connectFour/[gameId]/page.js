"use client";

import GameBoard from "@/components/connect4/GameBoard";
import AllTimeScore from "@/components/AllTimeScore";
import classes from "../pageContent.module.css";
import Player from "@/components/connect4/Player";
import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../../socket";

import {
  fetchOnlineMatch,
  updateOnlineBoard,
  rematchReq,
  OnlineMatchStartOver,
} from "@/app/server";
import winningCombinations from "@/winningCombinations/WINNING_COMBINATIONS";

const initialBoard = Array.from({ length: 6 }, () => Array(7).fill(null));

let turnsLength;
let playerChallenged;
let playerId;

const PLAYERS = {
  red: "Red Player",
  yellow: "Yellow Player",
};

let allTimeScoreBoard = {
  yellowPlayer: 0,
  redPlayer: 0,
  draw: 0,
};

function Home() {
  const [board, setBoard] = useState(initialBoard);
  const [winner, setWinner] = useState(null);
  const [hasDraw, setHasDraw] = useState(false);
  const [allTimeGameScore, setAllTimeGameScore] = useState(allTimeScoreBoard);
  const [redPlayerName, setRedPlayerName] = useState(PLAYERS.red);
  const [yellowPlayerName, setYellowPlayerName] = useState(PLAYERS.yellow);
  const [currentPlayer, setCurrentPlayer] = useState("red");
  const [newGameChallenge, setNewGameChallenge] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading, "isLoading state");

  const { gameId } = useParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const token = urlParams.get("token");
    console.log(token);

    if (token) {
      localStorage.setItem("gameToken:" + gameId, token);
    }
  }, []);

  useEffect(() => {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    const decodedToken = jwtDecode(userToken);
    console.log(decodedToken, "decoded Token");
    playerId = decodedToken.playedId;
    console.log(playerId, "playerId useEffect hook");

    socket.emit("joinRoom", { gameId });
    socket.emit("connectFour_Initial_GET", { gameId });

    socket.on("connectFour_Initial", (data) => {
      console.log("socket GET data:", data);
      if (typeof data === "object") {
        playerChallenged = data.playerChallenged;
        setWinner(data.winner);
        setRedPlayerName(data.playerNames.redPlayer);
        setYellowPlayerName(data.playerNames.yellowPlayer);
        setCurrentPlayer(data.currentPlayer);
        setAllTimeGameScore(data.allTimeWinners);
        setHasDraw(data.hasDraw);

        if (data.board) {
          setBoard(data.board);
          turnsLength = data.gameTurns;
        } 
      }  else {
        console.log(
        "newGameChallenge Socket useEffect RUNNING, playerChallenged:",
        data
      );
      playerChallenged = data;
      } 

      if (playerChallenged) {
        setNewGameChallenge(true);
      } else {
        setNewGameChallenge(false);
      }
    });

    // async function fetchGameData() {
    //   const data = await fetchOnlineMatch(gameId);
    //   console.log(data, "get Fn");

    //   if (data) {
    //     console.log(data, "if statement in get Fn");
    //     playerChallenged = data.playerChallenged;
    //     console.log(data.playerChallenged, "data.playerChallenged");
    //     setBoard(data.board);
    //     setWinner(data.winner);
    //     setRedPlayerName(data.playerNames.redPlayer);
    //     setYellowPlayerName(data.playerNames.yellowPlayer);
    //     setCurrentPlayer(data.currentPlayer);
    //     setAllTimeGameScore(data.allTimeWinners);
    //     setHasDraw(data.hasDraw);
    //     turnsLength = data.gameTurns
    //   }
    //   console.log(playerChallenged, "playerChallenged useEffect");
    //   if (playerChallenged) {
    //     setNewGameChallenge(true);
    //   }
    // }
    // fetchGameData();

    setIsLoading(false);
  }, [gameId]);

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

  function handleNewGameReq() {
    playerChallenged = playerId;
    setNewGameChallenge(true);
    // rematchReq(playerId, gameId, gameType);
    socket.emit("ConnectFour_startOver_Req", { playerId, gameId });
    console.log("handleNewGameReq running");
  }

  async function handleNewGame() {
    // await OnlineMatchStartOver(gameId, redPlayerName, yellowPlayerName);
    socket.emit('ConnectFour_startOver', { gameId, redPlayerName, yellowPlayerName, allTimeWinners: allTimeGameScore })
    setBoard(initialBoard);
    setWinner(null);
    turnsLength = 0;
    setHasDraw(false);
  }

  async function handleMove(column) {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    console.log(userToken, "userToken");
    const decodedToken = jwtDecode(userToken);
    console.log(decodedToken, "decoded Token");

    if (winner || hasDraw || isLoading) return;
    if (board[0][column]) return;

    if (currentPlayer !== decodedToken.playedId) {
      alert("It's not your turn !");
      return;
      // } else if (playerChallenged) {
      //   console.log(playerChallenged, "playerChallenge loop - handleMove Fn");
      //   if (playerChallenged !== decodedToken.playedId) {
      //     alert("It's not your turn !");
      //     return;
      //   }
    }

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
    console.log("updateOnlineBoard running handleMove Fn");
    // await updateOnlineBoard(column, gameId);
    socket.emit("ConnectFourMove", { column, gameId, token: userToken });
    setIsLoading(false);
  }

  return (
    <>
      <ol id={classes.players} className={classes["highlight-player"]}>
        <Player name={redPlayerName} isRedActive={currentPlayer === "red"} />
        <Player
          name={yellowPlayerName}
          isYellowActive={currentPlayer === "yellow"}
        />
      </ol>
      <div>
        <h1>Welcome to game {gameId}!</h1>
        <GameBoard
          board={board}
          winner={winner}
          hasDraw={hasDraw}
          handleMove={handleMove}
          handleNewGame={handleNewGame}
          handleNewGameReq={handleNewGameReq}
          newGameChallenge={newGameChallenge}
          playerId={playerId}
          playerChallenged={playerChallenged}
        />
      </div>
      <AllTimeScore
        allTimeGameScoreDraw={allTimeGameScore.draw}
        allTimeGameScorePlayerOne={allTimeGameScore.redPlayer}
        allTimeGameScorePlayerTwo={allTimeGameScore.yellowPlayer}
        playerOne={redPlayerName} // add name fram invetation form
        playerTwo={yellowPlayerName} // add name fram invetation form
      />
    </>
  );
}

export default Home;
