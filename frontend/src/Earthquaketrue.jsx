import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import "./earthquakemcq.css";

const API_URL = "http://localhost:5000";

async function saveScore(username, topic, type, score) {
  try {
    const res = await axios.post(`${API_URL}/scores`, { username, topic, type, score });
    console.log(res.data.message);
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

const questionsList = [
  { question: "Drop, Cover, and Hold On is the safest action during an earthquake.", answer: true },
  { question: "Using elevators during an earthquake is safe.", answer: false },
  { question: "Earthquakes can trigger landslides and tsunamis.", answer: true },
  { question: "Standing near windows during an earthquake is safe.", answer: false },
  { question: "Emergency kits should contain water, food, and a flashlight.", answer: true },
  { question: "After an earthquake, you should rush back into damaged buildings immediately.", answer: false },
  { question: "Helmets or covering your head can prevent injuries during earthquakes.", answer: true },
  { question: "You should stay calm and avoid spreading panic in a disaster.", answer: true },
  { question: "Floodwaters are always safe to walk or drive through.", answer: false },
  { question: "Calling the emergency number 112 is the correct step during disasters in India.", answer: true },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function EarthquakeTrue() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => setQuestions(shuffleArray(questionsList)), []);

  const handleNext = () => {
    let updatedScore = score;
    if (selected !== null && selected === questions[currentQ].answer) {
      updatedScore += 1;
      setScore(updatedScore);
    }

    setSelected(null);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(prev => prev + 1);
    } else {
      setFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      saveScore(username, "Earthquake", "True/False", updatedScore);
    }
  };

  const handleRetry = () => {
    setQuestions(shuffleArray(questionsList));
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
  };

  if (questions.length === 0) return null;

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="container-mcq">
      <main className="main-mcq">
        {!finished ? (
          <div className="quizCard">
            <div className="question">{currentQ + 1}. {questions[currentQ].question}</div>
            <div className="options">
              <label className={`option ${selected === true ? "selected" : ""}`} onClick={() => setSelected(true)}>
                <input type="radio" checked={selected === true} onChange={() => setSelected(true)} /> True ✅
              </label>
              <label className={`option ${selected === false ? "selected" : ""}`} onClick={() => setSelected(false)}>
                <input type="radio" checked={selected === false} onChange={() => setSelected(false)} /> False ❌
              </label>
            </div>

            <div className="progressBar">
              <div className="progressFill" style={{ width:` ${progress}%`}}></div>
            </div>

            <div className="btnContainer">
              <button className="nextBtn" onClick={handleNext} disabled={selected === null}>
                {currentQ + 1 === questions.length ? "Finish" : "Next →"}
              </button>
            </div>
          </div>
        ) : (
          <div className="resultCard">
            {showConfetti && <Confetti />}
            <h2 className="celebrationText">🎉 Hurray! You Did It!</h2>
            <img
              className="hurrayImg"
              src="https://i.pinimg.com/474x/b8/0a/76/b80a7666f481452d94fa44bb3b28592b.jpg"
              alt="Hurray Mickey"
            />
            <p className="scoreText">You scored <strong>{score} / {questions.length}</strong></p>
            <button className="restartBtn" onClick={handleRetry}>🔄 Play Again!</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default EarthquakeTrue;