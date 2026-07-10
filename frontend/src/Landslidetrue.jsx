import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import "./earthquakemcq.css";

const API_URL = "http://localhost:5000";

// Save score to backend
async function saveScore(username, topic, type, score) {
  try {
    const res = await axios.post(`${API_URL}/scores`, { username, topic, type, score });
    console.log(res.data.message);
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

// 10 kid-friendly Landslide True/False questions
const questionsData = [
  { question: "Landslides can happen after heavy rainfall.", answer: true },
  { question: "Planting trees on slopes can help prevent landslides.", answer: true },
  { question: "Steep slopes are more prone to landslides than flat areas.", answer: true },
  { question: "Building houses without proper support on slopes is safe.", answer: false },
  { question: "Good drainage on slopes reduces landslide risk.", answer: true },
  { question: "Landslides only happen in mountains.", answer: false },
  { question: "During a landslide, running sideways from the flow is dangerous.", answer: true },
  { question: "Human activities like mining can trigger landslides.", answer: true },
  { question: "After a landslide, it is safe to immediately go near the slope.", answer: false },
  { question: "Landslides can be sudden and dangerous.", answer: true },
];

// Utility to shuffle an array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function LandslideTrue() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // Shuffle questions on mount
  useEffect(() => {
    setQuestions(shuffleArray(questionsData));
  }, []);

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

      saveScore(username, "Landslide", "True/False", updatedScore);
    }
  };

  const handleRetry = () => {
    setQuestions(shuffleArray(questionsData));
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  };

  if (questions.length === 0) return null; // Wait until shuffle completes

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="container-mcq">
      <main className="main-mcq">
        {!finished ? (
          <div className="quizCard">
            <div className="question">
              {currentQ + 1}. {questions[currentQ].question}
            </div>

            <div className="options">
              <label
                className={`option ${selected === true ? "selected" : ""}`}
                onClick={() => setSelected(true)}
              >
                <input
                  type="radio"
                  checked={selected === true}
                  onChange={() => setSelected(true)}
                />
                True
              </label>

              <label
                className={`option ${selected === false ? "selected" : ""}`}
                onClick={() => setSelected(false)}
              >
                <input
                  type="radio"
                  checked={selected === false}
                  onChange={() => setSelected(false)}
                />
                False
              </label>
            </div>

            <div className="progressBar">
              <div className="progressFill" style={{ width:`${progress}%`}}></div>
            </div>

            <div className="btnContainer">
              <button
                className="nextBtn"
                onClick={handleNext}
                disabled={selected === null}
              >
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
            <p className="scoreText">
              You scored <strong>{score} / {questions.length}</strong>
            </p>
            <button className="restartBtn" onClick={handleRetry}>
              🔄 Play Again!
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default LandslideTrue;