import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import Confetti from "react-confetti";
import { useTranslation } from "react-i18next";
import "./earthquakemcq.css";
import axios from "axios";

const API_URL = "http://localhost:5000";

async function saveScore(username, topic, type, score) {
  try {
    const res = await axios.post(`${API_URL}/scores`, { username, topic, type, score });
    console.log(res.data.message);
  } catch (err) {
    console.error("Error saving score:", err);
  }
}

function Earthquakemcq() {
  const { t } = useTranslation('earthquakemcq');
  const location = useLocation();
  const username = location.state?.username || localStorage.getItem("username") || "Student";

  const [currentQ, setCurrentQ] = useState(0);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [selected, setSelected] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false);

  const questions = t("earthquakemcq.questions", { returnObjects: true });

  const handleNext = () => {
    let updatedScore = score;
    if (selected === questions[currentQ].answer) updatedScore += 1;

    setScore(updatedScore);
    setSelected(null);

    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
    } else {
      setFinished(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 5000);

      saveScore(username, "Earthquake", "MCQ", updatedScore);
    }
  };

  const handleRetry = () => {
    setCurrentQ(0);
    setScore(0);
    setFinished(false);
    setSelected(null);
  };

  const progress = ((currentQ + 1) / questions.length) * 100;

  return (
    <div className="container-mcq">
      <main className="main-mcq">
        {!finished ? (
          <div className="quizCard">
            <div className="question">{currentQ + 1}. {questions[currentQ].question}</div>
            <div className="options">
              {questions[currentQ].options.map((opt, idx) => (
                <label key={idx} className={`option ${selected === idx ? "selected" : ""}`} onClick={() => setSelected(idx)}>
                  <input type="radio" checked={selected === idx} onChange={() => setSelected(idx)} />
                  {opt}
                </label>
              ))}
            </div>
            <div className="progressBar">
              <div className="progressFill" style={{ width:`${progress}%` }}></div>
            </div>
            <div className="btnContainer">
              <button className="nextBtn" onClick={handleNext} disabled={selected === null}>
                {currentQ + 1 === questions.length ? t("earthquakemcq.buttons.finish") : t("earthquakemcq.buttons.next")}
              </button>
            </div>
          </div>
        ) : (
          <div className="resultCard">
            {showConfetti && <Confetti />}
            <h2 className="celebrationText">{t("earthquakemcq.messages.hurray")}</h2>
            <img
              className="hurrayImg"
              src="https://i.pinimg.com/474x/b8/0a/76/b80a7666f481452d94fa44bb3b28592b.jpg"
              alt="Hurray"
            />
            <p className="scoreText">{t("earthquakemcq.messages.score", { score, total: questions.length })}</p>
            <button className="restartBtn" onClick={handleRetry}>{t("earthquakemcq.buttons.playAgain")}</button>
          </div>
        )}
      </main>
    </div>
  );
}

export default Earthquakemcq;
