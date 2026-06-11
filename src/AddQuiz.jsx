import React, { useState } from "react";
import "./AddQuiz.css";

function AddQuiz() {
  const [step, setStep] = useState(1);
  const [topic, setTopic] = useState("");
  const [questionType, setQuestionType] = useState("");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [answer, setAnswer] = useState("");

  const [currentQuestionNum, setCurrentQuestionNum] = useState(1);
  const [tempQuestions, setTempQuestions] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const handleOptionChange = (value, index) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = () => {
    const newQ = {
      topic,
      type: questionType,
      question,
      options: questionType === "MCQ" ? options : [],
      answer,
    };

    setTempQuestions([...tempQuestions, newQ]);

    if (currentQuestionNum === 10) {
      // Finalize Quiz
      const newQuiz = {
        topic,
        type: questionType,
        questions: [...tempQuestions, newQ],
      };

      setQuizzes([...quizzes, newQuiz]);
      alert("✅ Quiz Created with 10 Questions!");
      resetAll();
    } else {
      // Go to next question
      setCurrentQuestionNum(currentQuestionNum + 1);
      setQuestion("");
      setOptions(["", "", "", ""]);
      setAnswer("");
    }
  };

  const resetAll = () => {
    setStep(1);
    setTopic("");
    setQuestionType("");
    setQuestion("");
    setOptions(["", "", "", ""]);
    setAnswer("");
    setCurrentQuestionNum(1);
    setTempQuestions([]);
  };

  return (
    <div className="aq-quiz-container">
      <h1 className="aq-quiz-title">📘 Quiz Creator</h1>

      {step === 1 && (
        <div className="aq-quiz-card aq-glass-card">
          <p className="aq-instruction">Click below to start creating a quiz 👇</p>
          <button className="aq-quiz-btn" onClick={() => setStep(2)}>
            ➕ Create Quiz
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="aq-quiz-card aq-glass-card">
          <label>Select Topic:</label>
          <select value={topic} onChange={(e) => setTopic(e.target.value)}>
            <option value="">-- Choose Topic --</option>
            <option value="Earthquake">🌎 Earthquake</option>
            <option value="Flood">🌊 Flood</option>
            <option value="Landslide">🏔 Landslide</option>
            <option value="Fire">🔥 Fire</option>
          </select>

          <label>Select Question Type:</label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="">-- Choose Type --</option>
            <option value="MCQ">MCQ</option>
            <option value="TrueFalse">True/False</option>
            <option value="Scenario">Scenario</option>
          </select>

          <button
            className="aq-quiz-btn"
            disabled={!topic || !questionType}
            onClick={() => setStep(3)}
          >
            Next ➡
          </button>
        </div>
      )}

      {step === 3 && (
        <div className="aq-quiz-card aq-glass-card">
          <h3>
            Question {currentQuestionNum} of 10 ({topic} - {questionType})
          </h3>
          <label>Enter Question:</label>
          <textarea
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Type your question here..."
          />

          {questionType === "MCQ" && (
            <div className="aq-options-section">
              {options.map((opt, i) => (
                <input
                  key={i}
                  type="text"
                  placeholder={`Option ${i + 1}`}
                  value={opt}
                  onChange={(e) => handleOptionChange(e.target.value, i)}
                />
              ))}
              <input
                type="text"
                placeholder="Correct Answer"
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          )}

          {questionType === "TrueFalse" && (
            <div className="aq-options-section">
              <select
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              >
                <option value="">-- Select Answer --</option>
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </div>
          )}

          {questionType === "Scenario" && (
            <div className="aq-options-section">
              <textarea
                placeholder="Expected Answer / Guidelines..."
                value={answer}
                onChange={(e) => setAnswer(e.target.value)}
              />
            </div>
          )}

          <button
            className="aq-quiz-btn aq-submit-btn"
            disabled={!question || !answer}
            onClick={handleAddQuestion}
          >
            {currentQuestionNum === 10
              ? "✅ Finalize Quiz"
              : "➕ Save & Next Question"}
          </button>
        </div>
      )}

      {/* Preview Section */}
      {quizzes.length > 0 && (
        <div className="aq-preview-section">
          <h2>📋 Created Quizzes</h2>
          {quizzes.map((quiz, idx) => (
            <div key={idx} className="aq-preview-card">
              <h3>
                Quiz {idx + 1}: {quiz.topic} - {quiz.type}
              </h3>
              {quiz.questions.map((q, i) => (
                <div key={i} className="aq-question-preview">
                  <p>
                    <b>{i + 1}.</b> {q.question}
                  </p>
                  {q.type === "MCQ" && (
                    <ul>
                      {q.options.map((opt, j) => (
                        <li key={j}>{opt}</li>
                      ))}
                    </ul>
                  )}
                  <p>
                    <b>Answer:</b> {q.answer}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default AddQuiz;
