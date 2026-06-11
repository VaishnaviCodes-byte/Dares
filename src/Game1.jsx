import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Game1.css";
import { useNavigate } from "react-router-dom";

export default function Game1() {
  const gameData = {
    flood: ["🩹", "🔦", "🧥", "🍱", "📄", "📯", "💧", "🥤", "⛑", "🛶", "✏", "🍕", "📚"],
    earthquake: ["🩹", "🔦", "⛑", "🧥", "📄", "📯", "🛠", "🥾", "📱", "🥤", "✏", "🍕", "🎒"],
    landslide: ["🩹", "⛑", "🥾", "🧥", "📄", "📯", "🛶", "💧", "🥤", "✏", "🍕", "🎒"],
    fire: ["🧯", "🩹", "😷", "🔦", "📄", "📯", "🛠", "💧", "🥤", "✏", "🍕", "🎒"],
  };
const navigate = useNavigate();
  const correctItems = [
    "🩹","🔦","🧥","🍱","📄","📯","⛑","🥾","🧯","😷","💧","🥤","🛶","🛠","📱","🎒"
  ];

  const [score, setScore] = useState(0);
  const [currentDisaster, setCurrentDisaster] = useState("");
  const [dragItems, setDragItems] = useState([]);
  const [dropItems, setDropItems] = useState([]);
  const [message, setMessage] = useState("");
  const [showGame, setShowGame] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [finalQuote, setFinalQuote] = useState("");
  const [pastScores, setPastScores] = useState([]);

  // ---------------- Fetch past scores from backend ----------------
  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) {
      axios
        .get(`http://localhost:5000/game-scores/${username}`)
        .then((res) => {
          setPastScores(res.data);
        })
        .catch((err) => {
          console.error("❌ Error fetching past game scores:", err.message);
        });
    }
  }, []);

  function startGame(disaster) {
    setCurrentDisaster(disaster);
    setDragItems(gameData[disaster]);
    setDropItems([]);
    setScore(0);
    setMessage("");
    setShowGame(true);
    setShowResult(false);
  }

  function allowDrop(e) {
    e.preventDefault();
  }

  function drop(e) {
    e.preventDefault();
    const data = e.dataTransfer.getData("text");

    if (correctItems.includes(data)) {
      if (!dropItems.includes(data)) {
        setDropItems([...dropItems, data]);
        setScore(score + 20);
      }
      setMessage("✅ Correct!");
    } else {
      setMessage("❌ Wrong item!");
    }
  }

  function dragStart(e, emoji) {
    e.dataTransfer.setData("text", emoji);
  }

  function backHome() {
    setShowGame(false);
    setShowResult(false);
  }

  // ---------------- Submit Game and Save to Backend ----------------
  async function submitGame() {
    setShowGame(false);
    setShowResult(true);

    const quotes = [
      "Preparation is the key to safety!",
      "Safety is not expensive, it's priceless.",
      "Be ready today for a safer tomorrow.",
      "Suraksha starts with Tayyari.",
    ];
    setFinalQuote(quotes[Math.floor(Math.random() * quotes.length)]);

    const username = localStorage.getItem("username"); 
    if (username) {
      try {
        // Save current game score
        await axios.post("http://localhost:5000/game-score", {
          username,
          disaster: currentDisaster,
          score,
        });

        // Fetch all past game scores again
        const res = await axios.get(`http://localhost:5000/game-scores/${username}`);
        setPastScores(res.data);

        console.log("✅ Game score saved and past scores updated");
      } catch (err) {
        console.error("❌ Error saving/fetching game score:", err.message);
      }
    }
  }

  return (
    <div className="ss-app">
      <button
        onClick={() => navigate(-1)}
        style={{
          position: "absolute",
          top: 70,
          left: 100,
          zIndex: 1000,
          padding: "8px 12px",
          background: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }}
      >
        ⬅ Back
      </button>
      {!showGame && !showResult && (
        <div className="ss-home">
          <button onClick={() => startGame("flood")}>
            <span className="ss-emoji">🌊</span>
            <div className="ss-disaster-name">Flood</div>
          </button>
          <button onClick={() => startGame("earthquake")}>
            <span className="ss-emoji">🌍</span>
            <div className="ss-disaster-name">Earthquake</div>
          </button>
          <button onClick={() => startGame("landslide")}>
            <span className="ss-emoji">🏔</span>
            <div className="ss-disaster-name">Landslide</div>
          </button>
          <button onClick={() => startGame("fire")}>
            <span className="ss-emoji">🔥</span>
            <div className="ss-disaster-name">Fire</div>
          </button>
        </div>
      )}

      {showGame && (
        <div className="ss-game-container">
          <h2>
            {currentDisaster.charAt(0).toUpperCase() + currentDisaster.slice(1)} Emergency Kit
          </h2>
          <div className="ss-drag-items">
            {dragItems.map((emoji, i) => (
              <span
                key={i}
                className="ss-drag-item"
                draggable
                onDragStart={(e) => dragStart(e, emoji)}
              >
                {emoji}
              </span>
            ))}
          </div>

          <div className="ss-drop-box" onDragOver={allowDrop} onDrop={drop}>
            {dropItems.map((emoji, i) => (
              <span key={i} className="ss-drag-item">
                {emoji}
              </span>
            ))}
          </div>

          <div className="ss-message">{message}</div>
          <div className="ss-score">Score: {score}</div>
          <button className="ss-submit-btn" onClick={submitGame}>Submit</button>
          <button className="ss-back-btn" onClick={backHome}>Back to Home</button>
        </div>
      )}

      {showResult && (
        <div className="ss-result-container">
          <div className="ss-final-score">Your Score: {score}</div>
          <h2>🎉 Congrats! 🎉</h2>
          <p className="ss-quote">{finalQuote}</p>

          {pastScores.length > 0 && (
            <div className="ss-past-scores">
              <h3>Past Game Scores:</h3>
              <ul>
                {pastScores.map((item, index) => (
                  <li key={index}>
                    {item.disaster.charAt(0).toUpperCase() + item.disaster.slice(1)}: {item.score} points
                  </li>
                ))}
              </ul>
            </div>
          )}

          <button className="ss-back-btn" onClick={backHome}>Back to Home</button>
        </div>
      )}
    </div>
  );
}