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

// Flood scenario questions
const questionsData = [
  { question: "You see flood water entering your street. What should you do?", options: ["Stay indoors and follow instructions", "Play in water", "Go swimming", "Ignore the water"], answer: 0 },
  { question: "Your school is near a river that is overflowing. Safe action?", options: ["Go to the river", "Move to high ground", "Jump into water", "Hide in basement"], answer: 1 },
  { question: "You find children playing near flood water. What should you do?", options: ["Tell them to play carefully", "Alert an adult immediately", "Join them", "Ignore"], answer: 1 },
  { question: "Emergency number to call in case of flood?", options: ["101", "100", "112", "108"], answer: 2 },
  { question: "You are trapped in your house during flood. First thing to do?", options: ["Go to roof and signal for help", "Jump into water", "Play with water", "Hide in closet"], answer: 0 },
  { question: "You notice a flooded road. Best action?", options: ["Walk through carefully", "Drive through slowly", "Avoid road and take high ground", "Jump in water"], answer: 2 },
  { question: "During heavy rain, water enters playground. Best action?", options: ["Let children play", "Move everyone to safe area", "Ignore water", "Start a game in water"], answer: 1 },
  { question: "You see live electric wires in water. What should you do?", options: ["Touch them to check", "Inform adult and stay away", "Throw objects", "Play nearby"], answer: 1 },
  { question: "You want to play safely in flood season. Which is correct?", options: ["Avoid flood water", "Play near river", "Splash in water", "Ignore warnings"], answer: 0 },
  { question: "After flood, what should you do before going outside?", options: ["Check for hazards and clean up", "Go play immediately", "Jump into puddles", "Ignore"], answer: 0 },
];

// Utility to shuffle array
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle questions and options
function shuffleQuestionOptions(questions) {
  return questions.map(q => {
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswerText = q.options[q.answer];
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return { ...q, options: shuffledOptions, answer: newAnswerIndex };
  });
}

function FloodScenario() {
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
    setQuestions(shuffleQuestionOptions(shuffleArray(questionsData)));
  }, []);

  const handleNext = () => {
    let updatedScore = score;
    if (selected === questions[currentQ].answer) updatedScore += 1;
    setScore(updatedScore);
    setSelected(null);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(prev => prev + 1);
    } else {
      setFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      saveScore(username, "Flood", "Scenario", updatedScore);
    }
  };

  const handleRetry = () => {
    setQuestions(shuffleQuestionOptions(shuffleArray(questionsData)));
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
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
              {questions[currentQ].options.map((opt, idx) => (
                <label
                  key={idx}
                  className={`option ${selected === idx ? "selected" : ""}`}
                  onClick={() => setSelected(idx)}
                >
                  <input type="radio" checked={selected === idx} onChange={() => setSelected(idx)} />
                  {opt}
                </label>
              ))}
            </div>
            <div className="progressBar">
              <div className="progressFill" style={{ width:`${progress}%`}}></div>
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
            <p className="scoreText">
              You scored <strong>{score} / {questions.length}</strong>
            </p>
            <button className="restartBtn" onClick={handleRetry}>🔄 Play Again!</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default FloodScenario;