import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import axios from "axios";
import "./earthquakemcq.css";

const API_URL = "http://localhost:5000";

// ✅ Save score to backend
async function saveScore(username, topic, type, score) {
  try {
    const res = await axios.post(`${API_URL}/scores`, { username, topic, type, score });
    console.log(res.data.message);
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

// ✅ Forest Fire MCQ questions
const questionsData = [
  { question: "What is the main cause of forest fires?", options: ["Lightning", "Careless humans", "Volcanoes", "All of the above"], answer: 3 },
  { question: "Which activity can prevent forest fires?", options: ["Burning trash in forest", "Campfires in safe areas", "Leaving glass bottles in forest", "Throwing matches"], answer: 1 },
  { question: "Smoke from a forest fire can cause?", options: ["Respiratory problems", "Good sleep", "Rain", "Stronger plants"], answer: 0 },
  { question: "Which animals are at risk during forest fires?", options: ["Birds", "Deer", "Monkeys", "All animals"], answer: 3 },
  { question: "What should you do if you see a small fire in forest?", options: ["Ignore it", "Try to put it out safely or alert adults", "Play near it", "Call friends to watch"], answer: 1 },
  { question: "Forest fires can destroy?", options: ["Trees", "Homes nearby", "Wildlife", "All of the above"], answer: 3 },
  { question: "During a forest fire, which is safest?", options: ["Hide in trees", "Run to open ground", "Go uphill quickly", "Stay in burning area"], answer: 1 },
  { question: "Hot weather increases the risk of?", options: ["Forest fires", "Snow", "Flood", "Earthquake"], answer: 0 },
  { question: "Which equipment helps firefighters?", options: ["Water hoses", "Fire trucks", "Fire blankets", "All of the above"], answer: 3 },
  { question: "Forest fires help in?", options: ["Destroying nature", "Natural forest regeneration", "Pollution", "None"], answer: 1 },
];

// ✅ Shuffle array function
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ✅ Shuffle options inside each question
function shuffleQuestionOptions(questions) {
  return questions.map(q => {
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswerText = q.options[q.answer];
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return { ...q, options: shuffledOptions, answer: newAnswerIndex };
  });
}

function ForestFireMCQ() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const shuffled = shuffleQuestionOptions(shuffleArray(questionsData));
    setQuestions(shuffled);
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
      saveScore(username, "Forest Fire", "MCQ", updatedScore);
    }
  };

  const handleRetry = () => {
    const shuffled = shuffleQuestionOptions(shuffleArray(questionsData));
    setQuestions(shuffled);
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
              <div className="progressFill" style={{ width: `${progress}% `}}></div>
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
            <img className="hurrayImg" src="https://i.pinimg.com/474x/b8/0a/76/b80a7666f481452d94fa44bb3b28592b.jpg" alt="Hurray Mickey" />
            <p className="scoreText">You scored <strong>{score} / {questions.length}</strong></p>
            <button className="restartBtn" onClick={handleRetry}>🔄 Play Again!</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default ForestFireMCQ;