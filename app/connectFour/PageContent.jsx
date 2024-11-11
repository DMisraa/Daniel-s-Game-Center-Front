"use client";

import { useEffect, useRef, useState } from "react";

import { fetchData, updateBoard, fetchPlayerName } from "../server";
import classes from "./pageContent.module.css";
import GameBoard from "../../components/connect4/GameBoard";
import Modal from "@/components/Modal";
import Player from "../../components/connect4/Player";
import winningCombinations from "../../winningCombinations/WINNING_COMBINATIONS";
import AllTimeScore from "@/components/AllTimeScore";
import Image from "next/image";
import Winner from "@/components/Winner";

export const initialBoard = Array.from({ length: 6 }, () =>
  Array(7).fill(null)
);

const PLAYERS = {
  red: "Red Player",
  yellow: "Blue Player",
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
  const [yellowPlayerName, setYellowPlayerName] = useState(PLAYERS.yellow);
  const [isRedEditing, setIsRedEditing] = useState(false);
  const [isYellowEditing, setIsYellowEditing] = useState(false);

  const [board, setBoard] = useState(initialBoard);
  const [currentPlayer, setCurrentPlayer] = useState("");
  const [winner, setWinner] = useState(null);
  const [hasDraw, setHasDraw] = useState(false);
  const [allTimeGameScore, setAllTimeGameScore] = useState(allTimeScoreBoard);
  const [isModalOpen, setModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(true);
  // console.log(isLoading, "isLoading state");

  const player = useRef({
    redPlayer: redPlayerName,
    yellowPlayer: yellowPlayerName,
  });

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData();
        if (data) {
          console.log(data.turnLength, "turnLength data recieved");
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
        console.log(data.turnLength, "turnLength use Effect hook");

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
    console.log("Open Modal Clicked");
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
    console.log("turnLength:", turnsLength);

    if (turnsLength === 42 && !winner) {
      setAllTimeGameScore((prevState) => ({
        ...prevState,
        draw: allTimeGameScore.draw + 1,
      }));
      setHasDraw(true);
    }
    console.log("handleMove 4 ");

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
    
    {startGame && (
      <div className={classes.gameboard_container}>
      <>
        {(winner || hasDraw) ? (
          <div className={classes.game_outcome}>
            <Winner 
              name={winner} 
              player={currentPlayer === "yellow" ? 'Player 1' : 'Player 2'} 
              handleStartGame={handleNewGame} 
            />
          </div>
        ) : (
          <GameBoard
            winner={winner}
            handleNewGameReq={handleNewGame}
            handleMove={handleMove}
            hasDraw={hasDraw}
            board={board}
          />
        )}
  
        <div id={classes.players} className={classes["highlight-player"]}>
          <div className={classes.player_container}>
            <Image
              src="/red_token.png"
              alt={"red player token"}
              width={60}
              height={60}
            />
            <div className={classes.playerOne}>
              <Player
                player={"Player 1"}
                name={redPlayerName}
                isEditing={isRedEditing}
                handlePlayerName={handleRedChange}
                handleEdit={handleRedEditClick}
                isRedActive={currentPlayer === "red"}
                ref={player}
                score={allTimeGameScore.redPlayer}
              />
            </div>
          </div>
          
          <div className={classes.player_container}>
            <Image
              src="/blue_token.png"
              alt={"blue player token"}
              width={60}
              height={60}
            />
            <div className={classes.playerTwo}>
              <Player
                player={"Player 2"}
                name={yellowPlayerName}
                isEditing={isYellowEditing}
                handlePlayerName={handleYellowChange}
                handleEdit={handleYellowEditClick}
                isYellowActive={currentPlayer === "yellow"}
                ref={player}
                score={allTimeGameScore.yellowPlayer}
              />
            </div>
          </div>
        </div>
      </>
       </div>
    )}
 
  
      

      {!startGame && (
        <>
          <div className={classes.container}>
            <div className={classes.game_container}>
              <h2 className={classes.game_text}> Game area </h2>
              <div className={classes.buttons_container}>
                <button
                  className={classes["start-game-button"]}
                  onClick={handleStartGame}
                >
                  Start to play !
                </button>
                <button className={classes["challenge-friend"]}>
                  Challenge A Friend !
                </button>
              </div>
            </div>
            <div id={classes.players} className={classes["highlight-player"]}>
              <div className={classes.playerOne}>
                <Player
                  player={"Player 1"}
                  name={redPlayerName}
                  isEditing={isRedEditing}
                  handlePlayerName={handleRedChange}
                  handleEdit={handleRedEditClick}
                  isRedActive={startGame && currentPlayer === "red"}
                  ref={player}
                  score={allTimeGameScore.redPlayer}
                />
              </div>
              <div className={classes.playerTwo}>
                <Player
                  player={"Player 2"}
                  name={yellowPlayerName}
                  isEditing={isYellowEditing}
                  handlePlayerName={handleYellowChange}
                  handleEdit={handleYellowEditClick}
                  isYellowActive={startGame && currentPlayer === "yellow"}
                  ref={player}
                  score={allTimeGameScore.yellowPlayer}
                />
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

// <AllTimeScore
// allTimeGameScoreDraw={allTimeGameScore.draw}
// allTimeGameScorePlayerOne={allTimeGameScore.redPlayer}
// allTimeGameScorePlayerTwo={allTimeGameScore.yellowPlayer}
// playerOne={"Red Player"} // add name fram invetation form
// playerTwo={"Yellow Player"} // add name fram invetation form
// />

// <Modal
// isOpen={isModalOpen}
// onClose={closeModal}
// gameType={"connectFour"}
// />

//               Start Game !

// onClick function for start game
//

// onclick function for creating an online game
// onClick={openModal}
