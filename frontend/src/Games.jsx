import React from "react";
import { useNavigate } from "react-router-dom";
import "./Games.css";


const GameSelection = () => {
  const navigate = useNavigate();

  return (
    <div className="game-selection-container">
      <h1 className="game-title">Choose Your Game</h1>
      <p className="game-subtitle">Learn Disaster Awareness While Having Fun!</p>
      <div className="games-grid">
        <div 
          className="game-card" 
          onClick={() => navigate("/game1")}
        >
          <img src="assets/drag-and-drop.png" alt="Drag & Drop Game" />
          <h2>Drag & Drop</h2>
          <p>Drag the items to the correct disaster safety zones!</p>
        </div>

        <div 
          className="game-card" 
          onClick={() => navigate("/game2")}
        >
          <img src="assets/kit-catch.png" alt="Run & Catch Game" />
          <h2>KitCatch</h2>
          <p>Dodge hazards and collect safety items as fast as you can!</p>
        </div>
      </div>
    </div>
  );
};

export default GameSelection;
