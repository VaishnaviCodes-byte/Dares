import React, { useEffect, useState } from "react";
import "./Game2.css";
import { useNavigate } from "react-router-dom";

export default function Game2() {
  const [pastResults, setPastResults] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username") || "Guest";

    let home = document.getElementById("g2-home");
    let game = document.getElementById("g2-game");
    let end = document.getElementById("g2-end");

    let player = document.getElementById("g2-player");
    let gameArea = document.getElementById("g2-gameArea");
    let scoreboard = document.getElementById("g2-scoreboard");
    let levelDisplay = document.getElementById("g2-levelDisplay");
    let endMessage = document.getElementById("g2-endMessage");

    let score = 0;
    let difficulty = "easy";
    let characterEmoji = "🧍‍♂";
    let itemInterval;
    let playerPos = { x: window.innerWidth / 2, y: 0 };
    const playerSpeed = 30;

    const correctItems = ["🩹", "🔦", "🛏", "🗣", "🚰", "🍱", "📄"];
    const wrongItems = ["✏", "🍕", "📏", "📱", "❌"];

    const levelSpeed = {
      easy: 2,
      medium: 4,
      hard: 6,
    };

    home.style.display = "block";

    window.selectCharacter = function (el, emoji) {
      characterEmoji = emoji;
      document
        .querySelectorAll(".g2-character-option")
        .forEach((elem) => elem.classList.remove("g2-selected"));
      el.classList.add("g2-selected");
    };

    window.startGame = function () {
      difficulty = document.getElementById("g2-difficulty").value;
      home.style.display = "none";
      game.style.display = "block";
      score = 0;
      playerPos.x = gameArea.offsetWidth / 2;
      player.style.left = playerPos.x + "px";
      player.innerText = characterEmoji;
      updateScoreboard();
      updateLevel();
      startFallingItems();
    };

    function startFallingItems() {
      itemInterval = setInterval(() => {
        let item = document.createElement("div");
        item.classList.add("g2-item");
        item.innerHTML =
          Math.random() < 0.7
            ? correctItems[Math.floor(Math.random() * correctItems.length)]
            : wrongItems[Math.floor(Math.random() * wrongItems.length)];
        item.style.left = Math.random() * (gameArea.offsetWidth - 50) + "px";
        item.style.top = "0px";
        gameArea.appendChild(item);

        let fallSpeed = levelSpeed[difficulty];
        let fallInterval = setInterval(() => {
          if (!document.body.contains(item)) {
            clearInterval(fallInterval);
            return;
          }
          let top = parseFloat(item.style.top);
          item.style.top = top + fallSpeed + "px";

          let rect1 = player.getBoundingClientRect();
          let rect2 = item.getBoundingClientRect();
          if (
            !(
              rect1.right < rect2.left ||
              rect1.left > rect2.right ||
              rect1.bottom < rect2.top ||
              rect1.top > rect2.bottom
            )
          ) {
            if (correctItems.includes(item.innerHTML)) {
              score += 20;
              updateScoreboard();
              item.remove();
              if (score >= 200) {
                gameOver(true);
              }
            } else {
              gameOver(false);
            }
          }

          if (top > gameArea.offsetHeight) {
            item.remove();
          }
        }, 20);
      }, 800);
    }

    function updateScoreboard() {
      scoreboard.innerText = "Score: " + score;
    }

    function updateLevel() {
      levelDisplay.innerText =
        "Level: " + difficulty.charAt(0).toUpperCase() + difficulty.slice(1);
    }

    async function saveScore(username, game2Score, difficulty) {
      try {
        await fetch("http://localhost:5000/api/game2/scores", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, game2Score, difficulty }),
        });

        fetchPastResults(username);
      } catch (err) {
        console.error("Error saving Game2 score:", err);
      }
    }

    async function fetchPastResults(username) {
      try {
        const res = await fetch(
          `http://localhost:5000/api/game2/scores/${username}`
        );
        const data = await res.json();
        setPastResults(data);
      } catch (err) {
        console.error("Error fetching past results:", err);
      }
    }

    function gameOver(completed = false) {
      clearInterval(itemInterval);
      game.style.display = "none";
      end.style.display = "block";

      // Save score for logged-in user
      saveScore(username, score, difficulty);

      if (completed) {
        endMessage.innerHTML = ` 🎯 You completed ${difficulty} level! 🎯 <br> Final Score: ${score} <br> Stay safe & prepared! 🌍`;
      } else {
        endMessage.innerHTML = `Game Over 😔 <br> Your Score: ${score} <br> Stay safe & prepared! 🌍`;
      }
    }

    window.restartGame = function () {
      end.style.display = "none";
      home.style.display = "block";
    };

    window.goHome = function () {
      end.style.display = "none";
      home.style.display = "block";
    };

    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") {
        playerPos.x -= playerSpeed;
        if (playerPos.x < 0) playerPos.x = 0;
      }
      if (e.key === "ArrowRight") {
        playerPos.x += playerSpeed;
        if (playerPos.x > gameArea.offsetWidth - 50)
          playerPos.x = gameArea.offsetWidth - 50;
      }
      player.style.left = playerPos.x + "px";
    });

    // Fetch user's past scores on mount
    fetchPastResults(username);
  }, []);

  return (
    <div>
      {/* HOME SCREEN */}
      <div id="g2-home">
        <div id="g2-characters">
          <span
            className="g2-character-option"
            onClick={(e) => window.selectCharacter(e.target, "🧍‍♂")}
          >
            🧍‍♂
          </span>
          <span
            className="g2-character-option"
            onClick={(e) => window.selectCharacter(e.target, "🧍‍♀")}
          >
            🧍‍♀
          </span>
        </div>

        <label htmlFor="g2-difficulty">Select Level:</label>
        <br />
        <select id="g2-difficulty">
          <option value="easy">Easy</option>
          <option value="medium">Medium</option>
          <option value="hard">Hard</option>
        </select>
        <br />
        <button className="g2-button" onClick={() => window.startGame()}>
          Start
        </button>
        <button className="g2-button" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>

      {/* GAME SCREEN */}
      <div id="g2-game">
        <div id="g2-scoreboard">Score: 0</div>
        <div id="g2-levelDisplay">Level: Easy</div>
        <div id="g2-gameArea">
          <div className="g2-player" id="g2-player"></div>
        </div>
      </div>

      {/* END SCREEN */}
      <div id="g2-end">
        <h1>🎉 Congrats! 🎉</h1>
        <div id="g2-endMessage"></div>

        {/* Past Results Section */}
        <h3>📜 Your Past Results</h3>
        <ul>
          {pastResults.map((result, index) => (
            <li key={index}>
              {result.username} - {result.game2Score} pts - {result.difficulty} -{" "}
              {new Date(result.date).toLocaleDateString()}
            </li>
          ))}
        </ul>

        <button className="g2-button" onClick={() => window.restartGame()}>
          Restart Game
        </button>
        <button className="g2-button" onClick={() => window.goHome()}>
          Back to Home
        </button>
      </div>
    </div>
  );
}
