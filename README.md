🎮 Game Center Front-End
Welcome to the Game Center Front-End! This interactive app lets you dive into classic games like Tic-Tac-Toe and Connect Four with real-time multiplayer, sleek design, and easy-to-use game invites. Ready to play? Check it out live here! 🚀

📋 Table of Contents
🎮 About the Project
🚀 Features
📦 Installation
🏗️ Usage
🌐 Environment Variables
👾 Tech Stack
📝 License
🎮 About the Project
This front-end, built in Next.js, is the interactive layer of our game center, communicating with a Node.js and MongoDB back-end to deliver an immersive gaming experience. Each move is powered by WebSockets for real-time action, while the UI is designed to be both engaging and responsive, thanks to custom styles inspired by a Figma design.

Live Demo: Play Now! 🌐

🚀 Features
Real-Time Action: Moves update instantly with WebSockets – no page refresh required.
Invite Friends: Send game invitations via WhatsApp links for quick multiplayer access.
Token-Based Security: Ensures each player’s moves are authenticated.
Modern, Responsive UI: Built with Figma-inspired design, accessible on desktop and mobile.
Easy Navigation: Choose your game and start playing in seconds.
📦 Installation
Get started locally with these steps:

Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/game-center-front.git
cd game-center-front
Install Dependencies:

bash
Copy code
npm install
Start the Development Server:

bash
Copy code
npm run dev
Visit the App: Open http://localhost:3000 in your browser.

🏗️ Usage
Choose a Game: Select from Tic-Tac-Toe or Connect Four.
Invite Friends: Share a link on WhatsApp for multiplayer.
Play in Real Time: Moves update instantly, thanks to WebSocket integration.
🌐 Environment Variables
To set up the environment variables, create a .env.local file in the root directory and add the following:

plaintext
Copy code
NEXT_PUBLIC_BASE_URL=your-backend-url
NEXT_PUBLIC_WS_URL=your-websocket-url
Tip: Make sure these URLs match your deployed backend and WebSocket servers.

👾 Tech Stack
Framework: Next.js, React
Styling: CSS with Figma-inspired design
Real-Time: WebSockets
Backend Integration: Node.js and MongoDB (find back-end repo here)
📝 License
This project is licensed under the MIT License. See the LICENSE file for details.

Enjoy the game, and thank you for stopping by! 🎉 Jump in and play now! 🚀
