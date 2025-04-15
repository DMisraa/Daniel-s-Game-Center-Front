export async function fetchData() {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/gameboard`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("error fetching the gameboard", error);
  }
}

export async function fetchOnlineMatch(gameId) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/${gameId}`);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();

    return data;
  } catch (error) {
    console.log("error fetching the gameboard", error);
  }
}

export async function updateBoard(column) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ column: parseInt(column) }),
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

export async function updateOnlineBoard(column, gameId) {
  const userToken = localStorage.getItem("gameToken:" + gameId)
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/${gameId}/move`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        'Authorization': `Bearer ${userToken}`
      },
      body: JSON.stringify({ column: parseInt(column) }),
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

export async function OnlineMatchStartOver(gameId, redPlayerName, yellowPlayerName) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/${gameId}/startOver`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ gameId, redPlayerName, yellowPlayerName})
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


export async function getCurrentPlayer() {
  
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/gameboard`);
    if (!response.ok) {
      throw new Error("Failed to fetch Currect Player");
    }
    const { currentPlayer } = await response.json();

    return currentPlayer;
  } catch (error) {
    console.log("error fetching the currect player", error);
  }
}

export async function fetchPlayerName(playerNames) {

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/connectFour/player`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify( playerNames ),
      
    });
    if (!response.ok) {
      throw new Error("Failed to post Currect Player");
    }
  } catch (error) {
    console.log("error posting the currect player", error);
  }
}

export async function gameInvite(formData, gameType, whatsappInvite) {     // used for both ticTacToe and connectFour
try {
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${gameType}/game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...formData,
      ...(whatsappInvite && { whatsappInvite })
  })
  });

  if (response.ok) {
    const { gameCreatorLink, invitedPlayerLink } = await response.json();
    return ({ gameCreatorLink, invitedPlayerLink })
  } else {
    alert("Failed to send invitation.");
  }
} catch (error) {
  console.error("Error sending invitation:", error);
  alert("There was an error sending the invitation.");
}}

export async function handleFooterFormSubmit(formData) {
   try {
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/footerContact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
   } catch (error) {
    console.error("Error sending message via Footer:", error);
   }
}

export async function rematchReq(playerId, gameId, gameType) {  // used for both games 
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/${gameType}/game/${gameId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ playerChallenged: playerId }),
    });
  
    if (!response.ok) {
      throw new Error("Failed to send a rematch Invite");
    }

  } catch (error) {
    console.error("Error sending the rematch invitation:", error);
    alert("There was an error sending the rematch invitation.");
  }}


