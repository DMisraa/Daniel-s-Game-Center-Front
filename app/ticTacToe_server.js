export async function updateBoard(gameBoard, gameId, playerNames) {
  const userToken = localStorage.getItem("gameToken:" + gameId)
  let method
  let sentData
  if (gameId) {
    method = 'PATCH'
    sentData = { gameBoard, playerNames }
  } else {
    method = 'PUT'
    sentData = gameBoard
  }
    try {
      const url = gameId
      ? `${process.env.NEXT_PUBLIC_BASE_URL}/ticTacToe/${gameId}/move`
      : `${process.env.NEXT_PUBLIC_BASE_URL}/ticTacToe/move`;

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        'Authorization': `Bearer ${userToken}`
        },
        body: JSON.stringify( sentData),
      });
  
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ticTacToe/player`, {
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
  
  export async function fetchData(gameId) {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ticTacToe/${gameId}`);
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
  
      return data;
    } catch (error) {
      console.log("error fetching the gameboard", error);
    }
  }

  export async function OnlineMatchStartOver(gameId, players) {
    console.log(gameId, players , 'data sent to server startover req')
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ticTacToe/${gameId}/startOver`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ gameId, players })
      });
  
      if (!response.ok) {
        const error = await response.json();
        console.error("Error in starting a new match:", error);
        return;
      }
    } catch (error) {
      console.error("Error in starting a new match:", error);
    }
  }

  export async function sendMail(playerNames, emailAdress, gameLinksWithTokens) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/ticTacToe/sendMail`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        playerNames,
        emailAdress,
        gameLinksWithTokens
      }),
    });
  
    if (response.ok) {
      console.log("Email sent successfully");
    } else {
      console.error("Failed to send email");
    }
  }