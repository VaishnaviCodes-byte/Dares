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

// Landslide scenario questions
const questionsData = [
  {
    question: "You see rocks falling down a slope near your school after heavy rain. What should you do?",
    options: [
      "Run towards the slope to check",
      "Move to open ground away from the slope",
      "Hide under a tree near the slope",
      "Stay near the school building"
    ],
    answer: 1,
  },
  {
    question: "Your family wants to build a small hut on a steep hill. What is safest?",
    options: [
      "Build without any support",
      "Choose a flat area away from steep slopes",
      "Build near the edge for a better view",
      "Build on loose soil"
    ],
    answer: 1,
  },
  {
    question: "During a hike, you notice the ground shaking and some soil sliding. What should you do first?",
    options: [
      "Call friends to join you",
      "Run quickly up the slope",
      "Move sideways to a safer open area",
      "Take a photo"
    ],
    answer: 2,
  },
  {
    question: "A heavy rainstorm has saturated a slope near your home. How can your family reduce landslide risk?",
    options: [
      "Cut down all trees",
      "Install proper drainage to remove excess water",
      "Dig holes randomly on the slope",
      "Build on top of loose soil"
    ],
    answer: 1,
  },
  {
    question: "You are at a playground near a hill and notice soil moving downhill. What’s the best action?",
    options: [
      "Stay and watch",
      "Run to open ground away from the slope",
      "Sit under a tree",
      "Go down the hill quickly"
    ],
    answer: 1,
  },
  {
    question: "Your school plans to have a picnic on a hill after rain. What should you consider?",
    options: [
      "Avoid steep slopes and unstable areas",
      "Go to the edge for fun",
      "Sit under loose rocks",
      "Ignore safety instructions"
    ],
    answer: 0,
  },
  {
    question: "During a landslide warning, your neighbor wants to go outside. What advice should you give?",
    options: [
      "Stay inside and move to a safe room",
      "Go near the slope to check",
      "Stand under trees",
      "Drive through the hill area"
    ],
    answer: 0,
  },
  {
    question: "You see a small landslide near a road. How can you help without getting hurt?",
    options: [
      "Warn others to stay away and call authorities",
      "Try to clear the rocks alone",
      "Stand on the slope to watch",
      "Take the shortest path through the slide"
    ],
    answer: 0,
  },
  {
    question: "Heavy rains are expected. What’s the safest place for your family?",
    options: [
      "On top of a steep hill",
      "Near loose rocks",
      "In a well-built house away from slopes",
      "Next to a riverbank on a slope"
    ],
    answer: 2,
  },
  {
    question: "A friend tells you that landslides only happen in mountains. What should you say?",
    options: [
      "Yes, it’s only mountains",
      "No, landslides can happen on any slope or hilly area",
      "Sometimes, only small hills",
      "I don’t know"
    ],
    answer: 1,
  },
];

// Shuffle utility
function shuffleArray(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function shuffleQuestionOptions(questions) {
  return questions.map((q) => {
    const shuffledOptions = shuffleArray(q.options);
    const correctAnswerText = q.options[q.answer];
    const newAnswerIndex = shuffledOptions.indexOf(correctAnswerText);
    return { ...q, options: shuffledOptions, answer: newAnswerIndex };
  });
}

function LandslideScenario() {
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

      saveScore(username, "Landslide", "Scenario", updatedScore);
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
                  <input
                    type="radio"
                    checked={selected === idx}
                    onChange={() => setSelected(idx)}
                  />
                  {opt}
                </label>
              ))}
            </div>

            <div className="progressBar">
              <div
                className="progressFill"
                style={{ width:` ${progress}% `}}
              ></div>
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

export default LandslideScenario;