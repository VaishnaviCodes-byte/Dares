import React, { useState } from 'react';
import './mainquiz.css';
import { useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";


function Mainquiz() {
  const topics = ["Earthquake", "Landslide", "Flood", "Forest fire"];
  const [activeTopic, setActiveTopic] = useState(null);
  const navigate = useNavigate();

  const handleOptionClick = (topic, type) => {
    if (topic === "Earthquake" && type === "Multiple Choice") navigate("/earthquake-mcq");
    else if (topic === "Earthquake" && type === "True / False") navigate("/earthquake-true");
    else if (topic === "Earthquake" && type === "Scenario") navigate("/earthquake-scenario");

    else if (topic === "Landslide" && type === "Multiple Choice") navigate("/landslide-mcq");
    else if (topic === "Landslide" && type === "True / False") navigate("/landslide-true");
    else if (topic === "Landslide" && type === "Scenario") navigate("/landslide-scenario");

    else if (topic === "Forest fire" && type === "Multiple Choice") navigate("/forestfire-mcq");
    else if (topic === "Forest fire" && type === "True / False") navigate("/forestfire-true");
    else if (topic === "Forest fire" && type === "Scenario") navigate("/forestfire-scenario");

    else if (topic === "Flood" && type === "Multiple Choice") navigate("/flood-mcq");
    else if (topic === "Flood" && type === "True / False") navigate("/flood-true");
    else if (topic === "Flood" && type === "Scenario") navigate("/flood-scenario");

    setActiveTopic(null);
  };

  const quizTypes = [
    { icon: "📚", label: "Multiple Choice" },
    { icon: "✅", label: "True / False" },
    { icon: "🎭", label: "Scenario" },
  ];

  return (
    <div className="quiz-container">


      <div className="main3">
        <aside className="sidebar-quiz">
          <p className="topic-title">Topics</p>
          <ul>
            {topics.map((topic) => (
              <li key={topic} onClick={() => setActiveTopic(activeTopic === topic ? null : topic)}>
                {topic}
              </li>
            ))}
          </ul>
          <div className="score-box"
            onClick={() => navigate("/score")}
            style={{ cursor: "pointer" }}
          >
            SCORE
          </div>
              <div className="Leaderboard-box"
                   onClick={() => navigate("/leaderboard")}
                   style={{ cursor: "pointer" }}
                >
                               LEADERBOARD
                  </div>
        </aside>

        <section className="content-quiz">
          <h2>Make learning fun & interactive!</h2>
          <div className="boy-quiz"></div>
          <div className="bubble-container">
            <div className="bubble bubble-sky" style={{ animationDelay: "0s" }}></div>
            <div className="bubble bubble-purple" style={{ animationDelay: "1s" }}></div>
            <div className="bubble bubble-green" style={{ animationDelay: "2s" }}></div>
            <div className="bubble bubble-yellow" style={{ animationDelay: "3s" }}></div>
          </div>
        </section>

        {activeTopic && (
          <div className="options-box">
            <h3>{activeTopic} Quiz</h3>
            <div className="quiz-type-container">
              {quizTypes.map((q) => (
                <div
                  key={q.label}
                  className="quiz-type-card"
                  onClick={() => handleOptionClick(activeTopic, q.label)}
                >
                  <div className="quiz-card-inner">
                    <div className="quiz-card-front">
                      <span className="quiz-icon">{q.icon}</span>
                      <p>{q.label}</p>
                    </div>
                    <div className="quiz-card-back">
                      <p>Start {q.label} ➡️</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>

  )
}

export default Mainquiz;
