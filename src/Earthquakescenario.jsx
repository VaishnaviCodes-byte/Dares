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

// 10 kid-friendly Earthquake scenario questions
const questionsData = [
  {
    question: "You are in your classroom when the ground starts shaking. What should you do first?",
    options: [
      "Run outside immediately",
      "Drop, Cover, and Hold On under the desk",
      "Call your friends",
      "Stay near the windows"
    ],
    answer: 1,
  },
  {
    question: "During an earthquake, you see a ceiling fan about to fall. What is the safest step?",
    options: [
      "Try to catch it",
      "Move away and cover your head",
      "Shout for help",
      "Ignore it and continue studying"
    ],
    answer: 1,
  },
  {
    question: "Your teacher instructs everyone to evacuate after shaking stops. What should you avoid?",
    options: [
      "Leave calmly through the stairs",
      "Push or rush others",
      "Follow teacher instructions",
      "Move away from buildings after exit"
    ],
    answer: 1,
  },
  {
    question: "You are outside when the earthquake begins. Where should you move?",
    options: [
      "Under a tree",
      "Near tall buildings",
      "Open ground away from structures",
      "Next to parked vehicles"
    ],
    answer: 2,
  },
  {
    question: "After the earthquake, you notice a gas leak. What should you do?",
    options: [
      "Light a match to check",
      "Turn off the gas and inform an adult",
      "Ignore it",
      "Open windows but stay inside"
    ],
    answer: 1,
  },
  {
    question: "You are in a library when an earthquake hits. Which action is correct?",
    options: [
      "Run towards the exit immediately",
      "Stand near bookshelves",
      "Drop under a sturdy table or desk",
      "Climb onto a chair for safety"
    ],
    answer: 2,
  },
  {
    question: "During aftershocks, what should you do?",
    options: [
      "Go back inside damaged buildings",
      "Stay in a safe open area",
      "Ignore them",
      "Use the lift"
    ],
    answer: 1,
  },
  {
    question: "Your friend is panicking and shouting during the quake. You should:",
    options: [
      "Shout louder than them",
      "Stay calm and guide them to safety",
      "Run away alone",
      "Record a video"
    ],
    answer: 1,
  },
  {
    question: "A teacher asks students to form a line outside the school. You should:",
    options: [
      "Push to get ahead",
      "Follow quietly and maintain distance",
      "Play with friends",
      "Run to collect personal belongings"
    ],
    answer: 1,
  },
  {
    question: "You see fallen electrical wires after the quake. What is the safest action?",
    options: [
      "Touch them to move out of the way",
      "Stay away and inform authorities",
      "Jump over them quickly",
      "Ignore them and continue walking"
    ],
    answer: 1,
  },
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

// Shuffle questions and their options
function shuffleQuestionOptions(questions) {
  return questions.map(q => {
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswerText = q.options[q.answer];
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return { ...q, options: shuffledOptions, answer: newAnswerIndex };
  });
}

function Earthquakescenario() {
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [questions, setQuestions] = useState([]);
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

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

      saveScore(username, "Earthquake", "Scenario", updatedScore);
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
            <div className="question">
              {currentQ + 1}. {questions[currentQ].question}
            </div>
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
              <div className="progressFill" style={{ width:`${progress}% `}}></div>
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
            <button className="restartBtn" onClick={handleRetry}>
              🔄 Play Again!
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Earthquakescenario;