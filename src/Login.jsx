import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.css";

const API_URL = "http://localhost:5000";

export function LoginSignup() {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState("student");
  const [form, setForm] = useState({ username: "", rollNo: "", email: "", password: "" });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      const url = isLogin ? "/login" : "/signup";
      const payload = {
        username: form.username,
        password: form.password,
        userType,
        rollNo: userType === "student" ? form.rollNo : undefined,
        email: userType === "teacher" ? form.email : undefined,
      };

      const res = await axios.post(`${API_URL}${url}`, payload);

      if (res.status === 200) {
        const msg = res.data.message.toLowerCase();

        if (msg.includes("welcome back") || msg.includes("login successful")) {
          // Successful login → go to awareness
        localStorage.setItem("userType", res.data.userType);
        localStorage.setItem("username", form.username);

          // localStorage.setItem("userType", res.data.userType); // "teacher" or "student"

          navigate("/awareness", { state: { username: form.username } });
          return;
        } else if (msg.includes("signup successful")) {
          setMessage("Signup successful! Please verify your email first.");
        } else if (msg.includes("verified")) {
          setMessage("✅ Email verified successfully! You can now login.");
        } else {
          setMessage(res.data.message);
        }
      }
    } catch (err) {
      if (err.response) {
        setMessage(err.response.data.message || "Server error");
      } else if (err.request) {
        setMessage("Server not reachable");
      } else {
        setMessage(err.message);
      }
    }
  };

  return (
    <div className="app-container">
      <div className="background-accent"></div>

      <div className="bubble"></div>
      <div className="bubble"></div>
      <div className="bubble"></div>

      <div className="login-card">
        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

        <div className="role-selector">
          <button
            className={userType === "student" ? "active" : ""}
            onClick={() => setUserType("student")}
          >
            Student
          </button>
          <button
            className={userType === "teacher" ? "active" : ""}
            onClick={() => setUserType("teacher")}
          >
            Teacher
          </button>
        </div>

        <input
          className="login-input"
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
        />
        {!isLogin && userType === "student" && (
          <input
            className="login-input"
            name="rollNo"
            placeholder="Roll Number"
            value={form.rollNo}
            onChange={handleChange}
          />
        )}
        {!isLogin && userType === "teacher" && (
          <input
            className="login-input"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
          />
        )}
        <input
          className="login-input"
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />

        <button className="login-button" onClick={handleSubmit}>
          {isLogin ? "Login" : "Sign Up"}
        </button>

        <p className="toggle-text">
          {isLogin ? "New user?" : "Already a user?"}{" "}
          <span
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
            }}
          >
            {isLogin ? "Sign Up" : "Login"}
          </span>
        </p>

        {message && <p className="message">{message}</p>}
      </div>
    </div>
  );
}

// ---------------- Email Verification ----------------
export function VerifyEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(`${API_URL}/verify/${token}`);
        setMessage(res.data);
        setTimeout(() => navigate("/loginSignup"), 3000);
      } catch (err) {
        console.log(err);
        setMessage(err.response?.data || "Error verifying email.");
        setTimeout(() => navigate("/loginSignup"), 3000);
      }
    };
    verify();
  }, [token, navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>{message}</h2>
      <p>You will be redirected to login...</p>
    </div>
  );
}