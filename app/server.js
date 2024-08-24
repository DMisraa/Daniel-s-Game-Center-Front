export async function fetchData() {
  try {
    const response = await fetch("http://localhost:4000/connectFour/gameboard");
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
    const response = await fetch("http://localhost:4000/connectFour/move", {
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

export async function getCurrentPlayer() {
  try {
    const response = await fetch("http://localhost:4000/connectFour/gameboard");
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
  console.log(playerNames, 'player names updating Fn')
  try {
    const response = await fetch("http://localhost:4000/connectFour/player", {
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

// export async function startFirstGame() {
//   try {
//       const response = await fetch("http://localhost:4000/gameboard", {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ player: "red" }),
//       });
//       if (!response.ok) {
//         const error = await response.json();
//         console.error("Error starting a game:", error);
//         return;
//       }
//     } catch (error) {
//       console.error("Error starting a game:", error);
//     }
// }
