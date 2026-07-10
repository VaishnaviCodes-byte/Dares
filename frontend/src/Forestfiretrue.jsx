import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import "./earthquakemcq.css"; // your quiz CSS

const API_URL = "http://localhost:5000";

// ✅ Function to save score
async function saveScore(username, topic, type, score) {
  try {
    const res = await axios.post(`${API_URL}/scores`, { username, topic, type, score });
    console.log(res.data.message);
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

const questionsList = [
  { question: "Forest fires can be caused by humans.", answer: true },
  { question: "Playing with matches in forests is safe.", answer: false },
  { question: "Smoke from fires can harm animals and humans.", answer: true },
  { question: "Rain reduces the risk of forest fires.", answer: true },
  { question: "You should hide under trees during a forest fire.", answer: false },
  { question: "Firefighters use water and blankets to control fires.", answer: true },
  { question: "Forest fires cannot happen in hot weather.", answer: false },
  { question: "Leaving glass bottles in forests can start fires.", answer: true },
  { question: "Forest fires only destroy trees, not animals.", answer: false },
  { question: "Natural forest regeneration can occur after a controlled fire.", answer: true },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function ForestFireTrue() {
  const location = useLocation();
  const navigate = useNavigate();
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
    updatedScore = score + 1;
    setScore(updatedScore);
  }

  setSelected(null);

  if (currentQ + 1 < questions.length) {
    setCurrentQ(prev => prev + 1);
  } else {
    setFinished(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 5000);

    // ✅ Save score, but DO NOT navigate to Score page
    saveScore(username, "Forest Fire", "True/False", updatedScore);

    // ❌ Remove this line:
    // navigate("/score", { state: { username } });
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
                <input type="radio" checked={selected === true} onChange={() => setSelected(true)} /> True
              </label>
              <label className={`option ${selected === false ? "selected" : ""}`} onClick={() => setSelected(false)}>
                <input type="radio" checked={selected === false} onChange={() => setSelected(false)} /> False
              </label>
            </div>

            <div className="progressBar">
              <div className="progressFill" style={{ width:` ${progress}% `}}></div>
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

export default ForestFireTrue;