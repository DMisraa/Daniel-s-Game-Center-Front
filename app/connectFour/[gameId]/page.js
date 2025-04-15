"use client";

import Header from "@/components/connect4/Header";
import GameBoard from "@/components/connect4/GameBoard";
import classes from "../pageContent.module.css";
import Player from "@/components/connect4/Player";
import Winner from "@/components/Winner";
import Draw from "@/components/Draw";
import Modal from "@/components/Modal/Modal";

import { jwtDecode } from "jwt-decode";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { socket } from "../../socket";
import Image from "next/image";
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
  const [isModalOpen, setModalOpen] = useState(false);

  const { gameId } = useParams();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("gameToken:" + gameId, token);
    }
  }, []);

  useEffect(() => {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    const decodedToken = jwtDecode(userToken);
    playerId = decodedToken.playedId;

    socket.emit("joinRoom", { gameId });
    socket.emit("connectFour_Initial_GET", { gameId });

    socket.on("connectFour_Initial", (data) => {
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
    socket.emit("ConnectFour_startOver_Req", { playerId, gameId });
  }

  async function handleNewGame() {
    socket.emit("ConnectFour_startOver", {
      gameId,
      redPlayerName,
      yellowPlayerName,
      allTimeWinners: allTimeGameScore,
    });
    setBoard(initialBoard);
    setWinner(null);
    turnsLength = 0;
    setHasDraw(false);
  }

  async function handleMove(column) {
    localStorage.getItem("gameToken:" + gameId);
    const userToken = localStorage.getItem("gameToken:" + gameId);
    const decodedToken = jwtDecode(userToken);
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
      setWinner(winningPlayer);
    } else {
      setCurrentPlayer(currentPlayer === "red" ? "yellow" : "red");
    }
    socket.emit("ConnectFourMove", { column, gameId, token: userToken });
    setIsLoading(false);
  }

  function openModal() {
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
  }

  return (
    <div>
      <Header />
      
    
        <div className={classes.gameboard_container}>
          {winner ? (
            <div className={classes.winner}>
              <Winner
                name={winner}
                player={currentPlayer === "yellow" ? "Player 1" : "Player 2"}
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
              board={board}
              winner={winner}
              hasDraw={hasDraw}
              handleMove={handleMove}
              handleNewGame={handleNewGame}
              handleNewGameReq={handleNewGameReq}
              newGameChallenge={newGameChallenge}
              playerId={playerId}
              playerChallenged={playerChallenged}
              isGameActive={true}
            />
            <Modal
            isOpen={isModalOpen}
            onClose={closeModal}
            gameType={"connectFour"}
          />
          </>
          )}
       
        <div id={classes.players}>
          <div className={classes.player_container}>
            <Image
              src="/red_token.png"
              alt={"red player token"}
              width={60}
              height={60}
            />
            <div
              className={
                currentPlayer === "red"
                  ? classes.playerOne_active
                  : classes.playerOne
              }
            >
              {currentPlayer === "red" ? (
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
                    score={allTimeGameScore.redPlayer}
                  />
                </>
              ) : (
                <Player
                  player={"Player 1"}
                  name={redPlayerName}
                  score={allTimeGameScore.redPlayer}
                />
              )}
            </div>
          </div>

          <div className={classes.player_container}>
            <Image
              src="/blue_token.png"
              alt={"blue player token"}
              width={60}
              height={60}
            />
            <div
            className={
              currentPlayer === "yellow"
                ? classes.playerTwo_active
                : classes.playerTwo
            }
          >
            {currentPlayer === "yellow" ? (
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
                  name={redPlayerName}
                  score={allTimeGameScore.redPlayer}
                />
              </>
            ) : (
              <Player
                player={"Player 2"}
                name={redPlayerName}
                score={allTimeGameScore.redPlayer}
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
