export async function updateBoard(gameboard) {
    try {
      const response = await fetch("http://localhost:4000/ticTacToe/move", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( gameboard ),
      });
      console.log(gameboard, 'gameBoard sent to server, server code')
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error making a move:", error);
        return;
      }
    } catch (error) {
      console.error("Error making a move:", error);
    }
  }

  export async function updatePlayerName(playerName, symbol) {
    try {
      const response = await fetch("http://localhost:4000/ticTacToe/player", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify( {playerName, symbol} ),
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error updating Player Name", error);
        return;
      }
    } catch (error) {
      console.error("Error making a move:", error);
    }
  }
  
  export async function fetchData() {
    try {
      const response = await fetch("http://localhost:4000/ticTacToe/gameData");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log("error fetching the gameboard", error);
    }
  }