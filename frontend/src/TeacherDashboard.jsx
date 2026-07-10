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
import "./TeacherDashboard.css";

function TeacherDashboard() {
  const teacherName =
    localStorage.getItem("username") ||
    localStorage.getItem("teacherName") ||
    localStorage.getItem("user") ||
    null;

  const [metrics, setMetrics] = useState({
    avgScore: 0,
    gamesPlayed: 0,
    overallProgress: 0,
  });
  const [scoreData, setScoreData] = useState([]);
  const [gamesData, setGamesData] = useState([]);
  const [progressData, setProgressData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchData(name) {
      setLoading(true);
      setError(null);
      try {
        const safeName = encodeURIComponent(name || "");
        const res = await axios.get(
          `http://localhost:5000/api/teacher-dashboard/${safeName}`
        );

        console.log("Dashboard raw response:", res.data);

        const respMetrics = res.data.metrics || {};
        setMetrics({
          avgScore: respMetrics.avgScore ?? 0,
          gamesPlayed: respMetrics.gamesPlayed ?? 0,
          overallProgress: respMetrics.overallProgress ?? 0,
        });

        setScoreData(res.data.scoreData || []);
        setGamesData(res.data.gamesData || []);
        setProgressData(res.data.progressData || []);
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Failed to load dashboard. Check console for details.");
      } finally {
        setLoading(false);
      }
    }

    if (!teacherName) {
      setError("Teacher username not found in localStorage. Please login.");
      return;
    }

    fetchData(teacherName);
  }, [teacherName]);

  const hasChartData = arr => Array.isArray(arr) && arr.length > 0;

  return (
    <div className="Admin-Dashboard-dashboard">
      <header className="Admin-Dashboard-hero">
        <h1>Teacher Dashboard</h1>
        <p>Monitor your students’ performance and overall progress</p>
      </header>

      {error && (
        <div className="Admin-Dashboard-error">
          <p style={{ color: "red" }}>{error}</p>
        </div>
      )}

      <section className="Admin-Dashboard-metrics">
        <div className="Admin-Dashboard-metric-card">
          <h3>Average Score</h3>
          <div className="Admin-Dashboard-metric-value">{metrics.avgScore}%</div>
          <div className="Admin-Dashboard-progress-bar">
            <div
              className="Admin-Dashboard-progress green"
              style={{ width: `${Math.min(metrics.avgScore, 100)}%` }}
            />
          </div>
        </div>

        <div className="Admin-Dashboard-metric-card">
          <h3>Games Played</h3>
          <div className="Admin-Dashboard-metric-value">{metrics.gamesPlayed}</div>
          <div className="Admin-Dashboard-progress-bar">
            <div
              className="Admin-Dashboard-progress orange"
              style={{
                width: `${Math.min((metrics.gamesPlayed / Math.max(1, 10)) * 100, 100)}%`,
              }}
            />
          </div>
        </div>

        <div className="Admin-Dashboard-metric-card">
          <h3>Overall Progress</h3>
          <div className="Admin-Dashboard-metric-value">{metrics.overallProgress}%</div>
          <div className="Admin-Dashboard-progress-bar">
            <div
              className="Admin-Dashboard-progress yellow"
              style={{ width: `${Math.min(metrics.overallProgress, 100)}%` }}
            />
          </div>
        </div>
      </section>

      <section className="Admin-Dashboard-charts">
        {loading && <p>Loading dashboard...</p>}

        {/* Average Score Trend */}
        <div className="Admin-Dashboard-chart-card">
          <h3>Average Score Trend</h3>
          {hasChartData(scoreData) ? (
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={scoreData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="score" stroke="#4facfe" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: 12 }}>No quiz scores to display.</div>
          )}
        </div>

        {/* Games Played */}
        <div className="Admin-Dashboard-chart-card">
          <h3>Games Played</h3>
          {hasChartData(gamesData) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={gamesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="played"
                  radius={[6, 6, 0, 0]}
                  fill="#f39c12" // ✅ changed bar color to orange
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: 12 }}>No game data to display.</div>
          )}
        </div>

        {/* Overall Progress */}
        <div className="Admin-Dashboard-chart-card">
          <h3>Overall Progress</h3>
          {hasChartData(progressData) ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar
                  dataKey="score"
                  radius={[6, 6, 0, 0]}
                  fill="#fbc531" // yellow
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div style={{ padding: 12 }}>No progress data to display.</div>
          )}
        </div>
      </section>
    </div>
  );
}

export default TeacherDashboard;
