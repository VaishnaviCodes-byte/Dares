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

const questionsData = [
  { question: "What should you do first if a flood warning is issued?", options: ["Go swimming", "Stay indoors and follow instructions", "Go hiking", "Play outside"], answer: 1 },
  { question: "Which area is safest during heavy flooding?", options: ["Low-lying areas", "Near rivers", "High ground", "Underground rooms"], answer: 2 },
  { question: "What should you avoid during a flood?", options: ["Move to high ground", "Touch flood water", "Follow authorities' advice", "Pack emergency kit"], answer: 1 },
  { question: "Emergency number to call in India for flood help?", options: ["101", "100", "112", "108"], answer: 2 },
  { question: "What should you keep in a flood emergency kit?", options: ["Water & food", "First aid", "Torch & batteries", "All of the above"], answer: 3 },
  { question: "If trapped in your house during flood, what is the best action?", options: ["Climb roof and signal for help", "Jump into flood water", "Stay inside without signaling", "Go into basement"], answer: 0 },
  { question: "Why should children avoid playing in flood water?", options: ["Water can carry germs and electricity", "Water is fun", "It is refreshing", "It makes rainbows"], answer: 0 },
  { question: "During flood, which items are most important to secure?", options: ["Toys", "Important documents and valuables", "Chairs", "Shoes"], answer: 1 },
  { question: "Which of these is a flood safety tip?", options: ["Drive through flooded roads", "Walk in flowing water", "Stay informed via news", "Ignore warnings"], answer: 2 },
  { question: "During a flood, why should you avoid walking through moving water?", options: ["It can be fun", "It may sweep you away and be dangerous", "It helps you exercise", "It improves balance"], answer: 1 },
];

function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestionOptions(questions) {
  return questions.map(q => {
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswerText = q.options[q.answer];
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return { ...q, options: shuffledOptions, answer: newAnswerIndex };
  });
}

function FloodMCQ() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const shuffledQuestions = shuffleQuestionOptions(shuffleArray(questionsData));
    setQuestions(shuffledQuestions);
  }, []);

  const handleNext = () => {
    let updatedScore = score;
    if (selected === questions[currentQ].answer) {
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

      saveScore(username, "Flood", "MCQ", updatedScore);
    }
  };

  const handleRetry = () => {
    const shuffledQuestions = shuffleQuestionOptions(shuffleArray(questionsData));
    setQuestions(shuffledQuestions);
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
              <div className="progressFill" style={{ width: `${progress}%` }}></div>
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

export default FloodMCQ;