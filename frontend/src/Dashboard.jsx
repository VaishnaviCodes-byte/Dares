import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import "./Dashboard.css";

function Dashboard() {
  const username = localStorage.getItem("username"); // make sure username is stored after login
  const [quizData, setQuizData] = useState([]);
  const [gameData, setGameData] = useState([]);
  const [awarenessData, setAwarenessData] = useState([]);
  const [metrics, setMetrics] = useState({
    quizzesCompleted: 0,
    avgScore: 0,
    gamesPlayed: 0,
    awarenessProgress: 0,
  });

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const res = await axios.get(`http://localhost:5000/api/dashboard/${username}`);
        const { quizData, gameData, awarenessData, metrics } = res.data;

        setQuizData(quizData);
        setGameData(gameData);
        setAwarenessData(awarenessData);

        setMetrics({
          quizzesCompleted: metrics.quizzesCompleted,
          avgScore: metrics.avgScore,
          gamesPlayed: metrics.gamesPlayed,
          awarenessProgress: metrics.awarenessProgress,
        });
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
      }
    }

    fetchDashboard();
  }, [username]);

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="hero">
        <h1>Student Dashboard</h1>
        <p>Monitor your disaster preparedness progress and achievements</p>
      </header>

      {/* Metrics */}
      <section className="metrics">
        <div className="metric-card">
          <h3>Quizzes Completed</h3>
          <div className="metric-value">{metrics.quizzesCompleted} / 12</div>
          <div className="progress-bar">
            <div
              className="progress"
              style={{ width: `${(metrics.quizzesCompleted / 12) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Average Score</h3>
          <div className="metric-value">{metrics.avgScore}%</div>
          <div className="progress-bar">
            <div
              className="progress green"
              style={{ width: `${metrics.avgScore}%` }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Games Played</h3>
          <div className="metric-value">{metrics.gamesPlayed} / 2</div>
          <div className="progress-bar">
            <div
              className="progress orange"
              style={{ width: `${(metrics.gamesPlayed / 2) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="metric-card">
          <h3>Awareness Progress</h3>
          <div className="metric-value">{metrics.awarenessProgress}%</div>
          <div className="progress-bar">
            <div
              className="progress yellow"
              style={{ width: `${metrics.awarenessProgress}%` }}
            ></div>
          </div>
        </div>
      </section>

      {/* Charts */}
      <section className="charts">
        {/* Quiz Scores */}
        <div className="chart-card">
          <h3>Quiz Scores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={quizData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="score"
                stroke="#4facfe"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Game Scores */}
        <div className="chart-card">
          <h3>Game Scores</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={gameData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="score" fill="#43e97b" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Awareness Levels */}
        <div className="chart-card">
          <h3>Awareness Levels</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={awarenessData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#fbc531" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}

export default Dashboard;
