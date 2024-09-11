"use client";

import classes from "../pageContent.module.css";
import { useState, useEffect } from "react";
import { updateBoard, fetchData, OnlineMatchStartOver } from "../../ticTacToe_server";
import Player from "@/components/ticTacToe/Player.jsx";
import GameOver from "@/components/ticTacToe/GameOver.jsx";
import GameBoard from "@/components/ticTacToe/GameBoard.jsx";
import WINNING_COMBINATIONS from "@/winningCombinations/ticTacToc_Combinations";
import AllTimeScore from "@/components/AllTimeScore";
import { useParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";
import { rematchReq } from "@/app/server";

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

let playerId;
let playerChallenged;
function deriveActivePlayer(gameTurns) {
  let currentPlayer = "X";

  if (gameTurns.length > 0 && gameTurns[0].player === "X") {
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
  console.log("deriveGameTurnes Fn mountened");
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
      console.log(winner, "winner name, derive winner ");
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
  const [currentPlayer, setCurrentPlayer] = useState('X')
  const [isLoading, setIsLoading] = useState(true);
  console.log(isLoading, 'isLoading state')
  console.log(currentPlayer, 'currentPlayer state')
  const { gameId } = useParams();
  console.log(gameId, "gameID");

  const activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameTurns(gameTurns);

  let winner = deriveWinner(players, gameBoard);

  console.log("component mountened");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    console.log(urlParams);
    const token = urlParams.get("token");
    console.log(token);

    if (gameTurns.length === 9 && !winner) {
      setHasDraw(true);
    }

    if (activePlayer === "X" && winner) {
      allTimeScore.O++;
      console.log("player O is the winner");
      setSavedWinner(players.O);
    } else if (activePlayer === "O" && winner) {
      allTimeScore.X++;
      console.log("player X is the winner");
      setSavedWinner(players.X);
    } else if (hasDraw) {
      allTimeScore.draw++;
      console.log("draw");
    }

    if (token) {
      localStorage.setItem("gameToken:" + gameId, token);
    }
  }, [hasDraw, winner]);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData(gameId);
        console.log(data, "data arrived from server");
        localStorage.getItem("gameToken:" + gameId);
        const userToken = localStorage.getItem("gameToken:" + gameId);
        const decodedToken = jwtDecode(userToken);
        console.log(decodedToken, "decoded Token");
        playerId = decodedToken.playedId;
        console.log(playerId, "playerId useEffect hook");

        if (data) {
          allTimeScore = data.allTimeWinners;
          console.log(data.allTimeWinners, "alltimeScore data Recieved")
          setPlayers(data.playerNames);
          playerChallenged = data.playerChallenged;
          setCurrentPlayer(data.currentPlayer)
          console.log(data.currentPlayer, 'currentPlayer recieved useEffect')
          setHasDraw(data.hasDraw);
          setSavedWinner(data.winner);
          const derivedGameBoard = data.board;
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

          console.log(derivedGameBoard, "fetched board");
          console.log(fetchedGameTurns, "derived game turns");
        }
        console.log(playerChallenged, "playerChallenged useEffect");
        if (playerChallenged) {
          setNewGameChallenge(true);
        }
      } catch (error) {
        console.log("Error fetching the game data", error);
      } finally {
        setIsLoading(false)
      }
    }

    getData();
  }, [gameId]);

  async function handleActivePlayer(rowIndex, colIndex) {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    console.log(userToken, "userToken");
    const decodedToken = jwtDecode(userToken);
    console.log(decodedToken, "decoded Token");
    console.log(decodedToken.playedId, 'token playedId')
    console.log(currentPlayer, 'currentPlayer handleActivePlayer Fn')
    if (currentPlayer !== decodedToken.playedId) {
      alert("It's not your turn !");
      console.log('Auth 1 running')
      return;
    } else if (playerChallenged) {
        console.log(playerChallenged, 'playerChallenge loop - handleMove Fn')
        if (playerChallenged !== decodedToken.playedId) {
            alert("It's not your turn !");
            console.log('Auth 2 running')
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
      console.log(updatedGameBoard, "updatedGameBoard");
      console.log(currentPlayer, "handleActivePlayer currectPlayer");

      updateBoard(updatedGameBoard, gameId, players);
      setIsLoading(false)
      console.log(updatedGameBoard, "updatedGameBoard in handleActivePlayer");

      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");

      return [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
    });
  }

  function handelNewGameClick() {
    setGameTurns([]);
  }

  function handleNewGameReq() {
    let gameType = "ticTacToe";
    playerChallenged = playerId;
    setNewGameChallenge(true);
    rematchReq(playerId, gameId, gameType);
    console.log("handleNewGameReq running");
  }

  async function handleNewGame() {
    await OnlineMatchStartOver(gameId, players)
    setGameTurns([])
    setSavedWinner(null);
    setCurrentPlayer('X')
    setHasDraw(false);
  }

  console.log(players, "players, state");

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
