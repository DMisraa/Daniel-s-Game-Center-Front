import Link from "next/link";
import classes from './page.module.css'

function About() {
  return (
    <div className={classes.container}>
      <h1>
        Welcome to Menahem Game Center, your game hub!
      </h1>
      <h2> Game Modes </h2>
      <h3> Local Play </h3>
      <h4>
        Play Tic-Tac-Toe or Connect Four on a single computer with friends or
        family. Keep track of scores with our all-time leaderboard perfect for
        some friendly competition !
      </h4>
      <h3> Online Matches </h3>
      <h4>
        Challenge a friend online! Send game invites via Email or WhatsApp and
        enjoy real-time gameplay with smooth turns and no refreshes.
      </h4>
      <ul>
        How It Works
        <li> Pick a Game: Choose between Tic-Tac-Toe and Connect Four. </li>
        <li> Select a Mode: Play locally or invite a friend online. </li>
        <li> Start Playing: Let the games begin and have fun! </li>
      </ul>
      <h4>
        At Menahem Game Center, we aim to bring people together through simple,
        enjoyable games. Whether you&apos;re side by side or miles apart, fun is
        just a click away.
      </h4>
      <p> Have questions or want to connect ? Reach out !  </p> 

      <ul>
        <li>
          <Link href={"https://www.linkedin.com/in/daniel-menahem/"}>
            LinkedIn
          </Link>
        </li>
        <li>
          <Link href={"https://github.com/DMisraa"}> GitHub </Link>
        </li>
        <li>
          <a href="mailto:danielmenahem90@gmail.com">Email Me</a>
        </li>
      </ul>
      <h3>Download My Resume</h3>
      <p>
        <a href="/Daniel_Menahem-CV.pdf" download="Daniel_Menahem_Resume.pdf">
          Click here to download my latest resume
        </a>
      </p>
    </div>
  );
}

export default About;
