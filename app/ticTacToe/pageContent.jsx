"use client";

import Player from "@/components/ticTacToe/Player.jsx";
import Draw from "@/components/Draw";
import GameBoard from "@/components/ticTacToe/GameBoard.jsx";
import Winner from "@/components/Winner";
import Modal from "@/components/Modal";

import classes from "./pageContent.module.css";
import { useState, useEffect } from "react";
import { updateBoard, fetchData } from "../ticTacToe_server";
import WINNING_COMBINATIONS from "@/winningCombinations/ticTacToc_Combinations";
import Image from "next/image";

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
  Draw: 0,
  O: 0,
};

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

function PageContent() {
  const [players, setPlayers] = useState(PLAYERS);
  const [gameTurns, setGameTurns] = useState([]);
  const [startGame, setStartGame] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  let activePlayer = deriveActivePlayer(gameTurns);
  const gameBoard = deriveGameTurns(gameTurns);
  let winner = deriveWinner(players, gameBoard);
  let hasDraw = gameTurns.length === 9 && !winner;

  if (activePlayer === "X" && winner) {
    allTimeScore.O++;
    winner = players.O;
  } else if (activePlayer === "O" && winner) {
    allTimeScore.X++;
    winner = players.X;
  } else if (hasDraw) {
    allTimeScore.Draw++;
  }

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData("gameData");

        if (data) {
          allTimeScore = data.allTimeScore;
          setPlayers(data.playerNames);
          const derivedGameBoard = data.gameBoard;
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

          if (fetchedGameTurns.length > 0) {
            setStartGame(true);
          }
        }
      } catch (error) {
        console.log("Error fetching the game data", error);
      } finally {
        setIsLoading(false);
      }
    }

    getData();
  }, []);

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  function handleActivePlayer(rowIndex, colIndex) {
    if (winner || hasDraw || isLoading) {
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
      updateBoard(updatedGameBoard);

      if (winner || hasDraw) {
        setStartGame(false);
      }

      return [
        { square: { row: rowIndex, col: colIndex }, player: currentPlayer },
        ...prevTurns,
      ];
    });
  }

  function handelNewGameClick() {
    setGameTurns([]);
  }

  function handleNewName(symbol, newName) {
    setPlayers((prevPlayers) => {
      return {
        ...prevPlayers,
        [symbol]: newName,
      };
    });
  }

  function handleStartGame() {
    setStartGame(true);
  }

  if (!startGame) {
    activePlayer = null;
  }

  return (
    <div className={classes.container}>
      <Modal isOpen={isModalOpen} onClose={closeModal} gameType={"ticTacToe"} />
      {!startGame && (
        <>
          <div id={classes["game-container"]}>
            <h2 className={classes.game_text}> Game area </h2>
            <div className={classes.buttons_container}>
              <button
                onClick={handleStartGame}
                className={classes["start-game-button"]}
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
          </div>
        </>
      )}
      {startGame && (
        <>
          {winner ? (
            <div className={classes.winner}>
              <Winner
                name={winner}
                player={activePlayer === "O" ? "Player 1" : "Player 2"}
                handleStartGame={handelNewGameClick}
                newChallenge={openModal}
              />
            </div>
          ) : hasDraw ? (
            <div className={classes.draw}>
              <Draw
                handleStartGame={handelNewGameClick}
                newChallenge={openModal}
              />
            </div>
          ) : (
            <div className={classes.board_container}>
              <GameBoard
                selectedPlayer={handleActivePlayer}
                activePlayerSymbol={activePlayer}
                board={gameBoard}
              />
            </div>
          )}
        </>
      )}

      <div id={classes.players}>
        <div className={classes.player_container}>
          {startGame && (
            <Image
              src="/player_X.png"
              alt={"player X token"}
              width={60}
              height={60}
            />
          )}
          <div className={classes.playerOne}>
            <Player
              player={"Player 1"}
              name={players.X}
              symbol="X"
              isActive={activePlayer === "X"}
              newPlayerName={handleNewName}
              score={allTimeScore.X}
            />
          </div>
        </div>
        <div className={classes.player_container}>
          {startGame && (
            <Image
              src="/player_O.png"
              alt={"player O token"}
              width={60}
              height={60}
            />
          )}
          <div className={classes.playerTwo}>
            <Player
              player={"Player 2"}
              name={players.O}
              symbol="O"
              isActive={activePlayer === "O"}
              newPlayerName={handleNewName}
              score={allTimeScore.O}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PageContent;
