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

const landslideQuestionsData = [
  { question: "What is a landslide?", options: ["A sudden flow of rocks and soil down a slope", "A type of flood", "Strong wind blowing trees", "A small earthquake"], answer: 0 },
  { question: "Which of these increases the risk of landslides?", options: ["Planting more trees", "Heavy rain on steep slopes", "Building dams safely", "Good drainage systems"], answer: 1 },
  { question: "During a landslide, what is the safest action?", options: ["Run downhill quickly", "Hide under a tree", "Move sideways away from the flow", "Climb a hill"], answer: 2 },
  { question: "What should schools teach students to prepare for landslides?", options: ["Dance routines", "Emergency evacuation drills", "Painting competitions", "Math practice"], answer: 1 },
  { question: "Which type of area is more prone to landslides?", options: ["Flat desert areas", "Steep hilly areas", "Beaches", "Plains"], answer: 1 },
  { question: "What should you avoid during a landslide?", options: ["Going near the slope", "Following emergency instructions", "Moving to safe zones", "Listening to adults"], answer: 0 },
  { question: "After a landslide, what is the first thing to check?", options: ["Collect souvenirs", "Check for injured people and help", "Go outside for fun", "Take pictures"], answer: 1 },
  { question: "Planting trees on slopes helps because:", options: ["Roots hold soil and prevent landslides", "Trees block the view", "Trees attract animals", "Trees make slopes slippery"], answer: 0 },
  { question: "Heavy rainfall is a common cause of landslides. True or False?", options: ["True", "False", "Sometimes", "Never"], answer: 0 },
  { question: "During landslides, staying inside a well-built house is generally:", options: ["Safe if away from slopes", "Very dangerous", "No different than being outside", "Recommended only at night"], answer: 0 },
];

// Shuffle helper
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Shuffle options inside each question
function shuffleQuestionOptions(questions) {
  return questions.map((q) => {
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswerText = q.options[q.answer];
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return { ...q, options: shuffledOptions, answer: newAnswerIndex };
  });
}

function LandslideMCQ() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const shuffled = shuffleQuestionOptions(shuffleArray(landslideQuestionsData));
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

      saveScore(username, "Landslide", "MCQ", updatedScore);
    }
  };

  const handleRetry = () => {
    const shuffled = shuffleQuestionOptions(shuffleArray(landslideQuestionsData));
    setQuestions(shuffled);
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

export default LandslideMCQ;