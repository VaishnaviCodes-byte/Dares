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

// Forest Fire scenario questions
const questionsList = [
  { question: "You see smoke coming from the forest. What should you do?", options: ["Ignore it and continue playing", "Tell an adult immediately", "Run towards the smoke", "Take a picture"], answer: 1 },
  { question: "Your friend lights a small fire in the park. What is the safe action?", options: ["Join them in lighting more fire", "Stop them and tell an adult", "Run away silently", "Throw water on yourself"], answer: 1 },
  { question: "You are camping and a fire spreads accidentally. What is the first thing to do?", options: ["Try to take photos", "Move to open area safely", "Hide under the tent", "Call friends to help"], answer: 1 },
  { question: "You find a discarded matchstick in the forest. What should you do?", options: ["Pick it and light it", "Pick it and inform an adult", "Leave it and walk away", "Hide it under leaves"], answer: 1 },
  { question: "During a forest fire, your pet is nearby. What should you do?", options: ["Leave the pet", "Take it to a safe open place immediately", "Hide it under a bush", "Tie it to a tree"], answer: 1 },
  { question: "You see dry leaves catching fire near your home. What is the safest action?", options: ["Step over the fire", "Call fire brigade or an adult", "Pour water on yourself", "Shout loudly and run"], answer: 1 },
  { question: "You notice someone burning trash in a forest. What should you do?", options: ["Join them", "Warn them to stop and seek adult help", "Run away", "Record on phone"], answer: 1 },
  { question: "A fire starts near a playground. What should you do first?", options: ["Move children to a safe distance", "Try to play around the fire", "Take photos", "Call a friend for help"], answer: 0 },
  { question: "You see sparks from a campfire drifting to dry grass. What should you do?", options: ["Extinguish sparks or alert an adult", "Stand and watch", "Run across the sparks", "Move objects closer to sparks"], answer: 0 },
  { question: "You want to play safely in a forest area during summer. What should you avoid?", options: ["Avoid lighting any fire or matches", "Carry water bottle", "Stay in shaded area", "Wear hat and sunglasses"], answer: 0 },
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

function ForestFireScenario() {
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
    setQuestions(shuffleQuestionOptions(shuffleArray(questionsList)));
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

      saveScore(username, "Forest Fire", "Scenario", updatedScore);
    }
  };

  const handleRetry = () => {
    setQuestions(shuffleQuestionOptions(shuffleArray(questionsList)));
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

export default ForestFireScenario;