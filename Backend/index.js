import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import nodemailer from "nodemailer";
import crypto from "crypto";
import bcrypt from "bcryptjs";

// ---------------- Config ----------------
const PORT = 5000;
const FRONTEND_URL = process.env.FRONTEND_URL;; // Frontend URL
const EMAIL_USER = "rakshitamirji77@gmail.com"; // Gmail
const EMAIL_PASS = "axrohcrqpevlrant"; // Gmail app password

// ---------------- MongoDB Connection ----------------
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.log("❌ MongoDB error:", err));

// ---------------- User Schema ----------------
const { Schema, model } = mongoose;

const userSchema = new Schema({
  username: { type: String, required: true, unique: true },
  rollNo: String,
  email: { type: String, required: function () { return this.userType === "teacher"; } },
  password: { type: String, required: true },
  userType: { type: String, required: true },
  verified: { type: Boolean, default: false },
  verificationToken: String,
  tokenExpiry: Date,
});

// ---------------- Score Schema ----------------
const scoreSchema = new Schema({
  username: { type: String, required: true }, // link to student
  topic: { type: String, required: true }, // Earthquake, Landslide, etc.
  type: { type: String, required: true },  // MCQ, True/False, Scenario
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const Score = model("Score", scoreSchema);

const User = model("User", userSchema);

// ---------------- Express Setup ----------------
const app = express();
/// */
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cors({
  origin: ["http://localhost:3000", "http://localhost:5173","https://dares-pi.vercel.app"], // your frontend URLs
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// ---------------- Nodemailer Setup ----------------
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

// ---------------- Signup Route ----------------
app.post("/signup", async (req, res) => {
  try {
    const { username, rollNo, email, password, userType } = req.body;

    if (userType === "student" && (!username || !rollNo || !password))
      return res.status(400).json({ message: "Fill all student fields!" });

    if (userType === "teacher" && (!username || !email || !password))
      return res.status(400).json({ message: "Fill all teacher fields!" });

    const existingUser = await User.findOne({ username });
    if (existingUser) return res.status(400).json({ message: "Username already exists!" });

    const hashedPassword = await bcrypt.hash(password, 10);

    if (userType === "teacher") {
      const verificationToken = crypto.randomBytes(32).toString("hex");
      const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        userType,
        verificationToken,
        tokenExpiry,
      });

      await newUser.save();

      const mailOptions = {
        from: EMAIL_USER,
        to: email,
        subject: "Verify your email",
        html: `<p>Hello ${username},</p>
               <p>Click below to verify your email (valid 24 hours):</p>
               <a href="https://dares-zdxx.onrender.com/verify/${verificationToken}">Verify Email</a>`,
      };

      await transporter.sendMail(mailOptions);
      return res.status(200).json({ message: "Signup successful! Check your email for verification." });
    } else {
      const newUser = new User({
        username,
        rollNo,
        password: hashedPassword,
        userType,
        verified: true,
      });
      await newUser.save();
      return res.status(200).json({ message: "Signup successful! You can login immediately." });
    }

  } catch (err) {
    console.error("❌ Signup error:", err);
    res.status(500).json({ message: "Server error during signup." });
  }
});

// ---------------- Login Route ----------------
app.post("/login", async (req, res) => {
  try {
    const { username, password, userType } = req.body;
    const user = await User.findOne({ username });

    if (!user) return res.status(400).json({ message: "User not found!" });
    if (user.userType !== userType) return res.status(400).json({ message: "Wrong login type!" });
    if (!user.verified) return res.status(400).json({ message: "Verify email first!" });

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) return res.status(400).json({ message: "Incorrect password!" });

    res.status(200).json({
  message: `Welcome back ${userType} ${username}!`,
  userType: user.userType,   // ✅ send userType
  username: user.username    // ✅ send username (optional)
});

  } catch (err) {
    console.error("❌ Login error:", err);
    res.status(500).json({ message: "Server error during login." });
  }
});

// ---------------- Email Verification Route ----------------
app.get("/verify/:token", async (req, res) => {
  try {
    const { token } = req.params;
    const user = await User.findOne({ verificationToken: token });

    if (!user) return res.status(400).send("Invalid or expired verification link.");
    if (user.tokenExpiry < Date.now()) return res.status(400).send("Verification link expired.");

    user.verified = true;
    user.verificationToken = undefined;
    user.tokenExpiry = undefined;
    await user.save();

    res.send("✅ Email verified successfully! You can now login.");
  } catch (err) {
    console.error("❌ Verification error:", err);
    res.status(500).send("Server error during verification.");
  }
});

// ---------------- Test Route ----------------
app.get("/", (req, res) => res.send("Backend working!"));

// ---------------- Start Server ----------------
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
// Save score for every attempt
app.post("/scores", async (req, res) => {
  try {
    const { username, topic, type, score } = req.body;

    if (!username || !topic || !type || score === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Save score for this student
    const newScore = new Score({ username, topic, type, score });
    await newScore.save();

    res.status(200).json({ message: "✅ Score saved successfully!", score: newScore });
  } catch (err) {
    console.error("❌ Save score error:", err);
    res.status(500).json({ message: "Error saving score" });
  }
});


// ---------------- Get Scores for a Student ----------------

// Get all scores for a student
app.get("/scores/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const scores = await Score.find({ username }).sort({ date: -1 });
    res.status(200).json(scores);
  } catch (err) {
    console.error("❌ Fetch scores error:", err);
    res.status(500).json({ message: "Error fetching scores" });
  }
});

// ---------------- StudentID Schema ----------------
const studentIDSchema = new Schema({
  username: { type: String, required: true, unique: true }, // link to student
  name: String,
  cls: String,
  roll: String,
  blood: String,
  allergy: String,
  gname: String,
  gphone: String,
  photo: String, // store URL or base64
});

const StudentID = model("StudentID", studentIDSchema);

// ---------------- Middleware: Authentication ----------------
const verifyUser = (req, res, next) => {
  const loggedInUser = req.headers["x-username"]; // must be sent from frontend
  if (!loggedInUser)
    return res.status(401).json({ message: "Unauthorized: username missing" });
  req.loggedInUser = loggedInUser;
  next();
};
// ---------------- Save or Update Student ID ----------------
app.post("/studentid", verifyUser, async (req, res) => {
  try {
    const { name, cls, roll, blood, allergy, gname, gphone, photo } = req.body;
    const username = req.loggedInUser;

    if (!username) 
      return res.status(400).json({ message: "Username missing!" });

    // Update existing or create new
    const student = await StudentID.findOneAndUpdate(
      { username },
      { name, cls, roll, blood, allergy, gname, gphone, photo },
      { new: true, upsert: true } // upsert = create if not exist
    );

    res.status(200).json({ message: "Student ID saved successfully!", student });
  } catch (err) {
    console.error("❌ Save Student ID error:", err);
    res.status(500).json({ message: "Error saving student ID", error: err.message });
  }
});

// ---------------- Get Student ID ----------------
app.get("/studentid", verifyUser, async (req, res) => {
  try {
    const username = req.loggedInUser;
    const student = await StudentID.findOne({ username });
    if (!student) return res.status(404).json({ message: "Student ID not found" });

    res.status(200).json(student);
  } catch (err) {
    console.error("❌ Fetch Student ID error:", err);
    res.status(500).json({ message: "Error fetching student ID" });
  }
});

// ---------------- Game Score Schema ----------------
const gameScoreSchema = new Schema({
  username: { type: String, required: true }, // student username
  disaster: { type: String, required: true }, // flood, earthquake, landslide, fire
  score: { type: Number, required: true },
  date: { type: Date, default: Date.now },
});

const GameScore = model("GameScore", gameScoreSchema);

// ---------------- Save Game Score ----------------
app.post("/game-score", async (req, res) => {
  try {
    const { username, disaster, score } = req.body;

    if (!username || !disaster || score === undefined) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newGameScore = new GameScore({ username, disaster, score });
    await newGameScore.save();

    res.status(200).json({ message: "✅ Game score saved successfully!", score: newGameScore });
  } catch (err) {
    console.error("❌ Save game score error:", err);
    res.status(500).json({ message: "Error saving game score" });
  }
});

// ---------------- Get all game scores for a student ----------------
app.get("/game-scores/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const scores = await GameScore.find({ username }).sort({ date: -1 });
    res.status(200).json(scores);
  } catch (err) {
    console.error("❌ Fetch game scores error:", err);
    res.status(500).json({ message: "Error fetching game scores" });
  }
});

// ---------------- Schema & Model ----------------
const game2ScoreSchema = new mongoose.Schema({
  username: { type: String, required: true },
  game2Score: { type: Number, required: true },
  difficulty: { type: String, default: "easy" },
  date: { type: Date, default: Date.now },
});

const Game2Score = mongoose.model("Game2Score", game2ScoreSchema);

// ---------------- Save Game2 Score ----------------
app.post("/api/game2/scores", async (req, res) => {
  try {
    const { username, game2Score, difficulty } = req.body;
    if (!username || game2Score === undefined) {
      return res.status(400).json({ message: "Username and score required" });
    }
    const newScore = new Game2Score({ username, game2Score, difficulty });
    await newScore.save();
    res.json({ message: "✅ Game2 score saved successfully!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Error saving Game2 score" });
  }
});

// ---------------- Get scores for a specific user ----------------
app.get("/api/game2/scores/:username", async (req, res) => {
  try {
    const { username } = req.params;
    const scores = await Game2Score.find({ username }).sort({ date: -1 });
    res.json(scores);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "❌ Error fetching Game2 scores" });
  }
});

// ---------------- Dashboard Route ----------------
app.get("/api/dashboard/:username", async (req, res) => {
  try {
    const { username } = req.params;

    // --- Quiz Data ---
    const quizScores = await Score.find({ username }).sort({ date: 1 });
    const quizData = quizScores.map(q => ({
      name: q.topic,
      score: q.score,
    }));

    const quizzesCompleted = quizScores.length;
    const avgScore =
      quizzesCompleted > 0
        ? Math.round(quizScores.reduce((sum, q) => sum + q.score, 0) / quizzesCompleted)
        : 0;

    // --- Game Data ---
    const gameScores = await GameScore.find({ username });
    const game2Scores = await Game2Score.find({ username });

    // Merge game data for charts
    const gameMap = {};

    gameScores.forEach(g => {
      gameMap[g.disaster] = (gameMap[g.disaster] || 0) + g.score; // sum of scores
    });

    game2Scores.forEach(g => {
      gameMap["Game 2"] = (gameMap["Game 2"] || 0) + g.game2Score;
    });

    const gameData = Object.keys(gameMap).map(key => ({
      name: key,
      score: gameMap[key],
    }));

    const gamesPlayed = gameScores.length + game2Scores.length;

    // --- Awareness Data (average quiz score per topic) ---
    const topicMap = {};
    quizScores.forEach(q => {
      if (!topicMap[q.topic]) topicMap[q.topic] = [];
      topicMap[q.topic].push(q.score);
    });

    const awarenessData = Object.keys(topicMap).map(topic => ({
      name: topic,
      value: Math.round(topicMap[topic].reduce((a, b) => a + b, 0) / topicMap[topic].length),
    }));

    const totalAwareness = awarenessData.reduce((sum, item) => sum + item.value, 0);
    const awarenessProgress = awarenessData.length > 0 ? Math.round(totalAwareness / awarenessData.length) : 0;

    res.status(200).json({
      quizData,
      gameData,
      awarenessData,
      metrics: {
        quizzesCompleted,
        avgScore,
        gamesPlayed,
        awarenessProgress,
      },
    });
  } catch (err) {
    console.error("❌ Dashboard fetch error:", err);
    res.status(500).json({ message: "Error fetching dashboard data" });
  }
});

// POST route to send email
app.post("/send-email", async (req, res) => {
  const { name, email, location, disasterType, description } = req.body;

  try {
    // Setup transporter (Gmail)
    let transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "rakshitamirji77@gmail.com",   // 👉 replace with your Gmail
        pass: "axrohcrqpevlrant",     // 👉 use Gmail App Password (not your normal password)
      },
    });

    // Email content
    let mailOptions = {
      from: email, // sender (user’s email)
      to: "yourgmail@gmail.com", // 👉 replace with your Gmail (receiver)
      subject:`🚨 Disaster Report:${disasterType}`  ,
      html: `
        <h2>New Disaster Report</h2>
        <p><b>Name:</b> ${name}</p>
        <p><b>Email:</b> ${email}</p>
        <p><b>Location:</b> ${location}</p>
        <p><b>Disaster Type:</b> ${disasterType}</p>
        <p><b>Description:</b> ${description}</p>
        <hr />
        <p style="color:gray;font-size:12px;">This report was submitted via Disaster Preparedness App.</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Report sent successfully!" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.json({ success: false, message: "Failed to send report." });
  }
});

// Start serve

// -----------------------------✅ Route: Get combined dashboard data for all students
app.get("/api/teacher-dashboard/:teacherName", async (req, res) => {
  try {
    const { teacherName } = req.params;
    console.log("GET /api/teacher-dashboard requested for teacherName:", teacherName);

    // Fetch all students
    const students = await User.find({ userType: "student" });

    if (!students.length) {
      return res.status(200).json({
        requestedTeacher: teacherName || null,
        metrics: { avgScore: 0, gamesPlayed: 0, overallProgress: 0 },
        scoreData: [],
        gamesData: [],
        progressData: []
      });
    }

    const topics = ["Earthquake", "Flood", "Landslide", "Fire"];
    const topicTotals = { Earthquake: 0, Flood: 0, Landslide: 0, Fire: 0 };
    const topicCounts = { Earthquake: 0, Flood: 0, Landslide: 0, Fire: 0 };

    let game1Played = 0;
    let game2Played = 0;

    for (const student of students) {
      const { username } = student;

      // Quiz Scores
      const scores = await Score.find({ username });
      scores.forEach(s => {
        const normalized = String(s.topic || "")
          .trim()
          .replace(/\b\w/, c => c.toUpperCase()); // capitalize first letter
        if (topics.includes(normalized)) {
          topicTotals[normalized] += s.score;
          topicCounts[normalized]++;
        }
      });

      // Games
      const game1Scores = await GameScore.find({ username });
      const game2Scores = await Game2Score.find({ username });
      if (game1Scores.length) game1Played++;
      if (game2Scores.length) game2Played++;
    }

    // Prepare quiz data
    const scoreData = topics.map(topic => ({
      name: topic,
      score: topicCounts[topic] ? Math.round(topicTotals[topic] / topicCounts[topic]) : 0
    }));

    // Games data
    const gamesData = [
      { name: "Game 1", played: game1Played },
      { name: "Game 2", played: game2Played }
    ];

    // Overall progress
    const overallProgress = topics.length
      ? Math.round(scoreData.reduce((sum, t) => sum + t.score, 0) / topics.length)
      : 0;

    const metrics = {
      avgScore: overallProgress,
      gamesPlayed: game1Played + game2Played,
      overallProgress
    };

    const progressData = scoreData.map(item => ({ name: item.name, score: item.score }));

    res.status(200).json({
      requestedTeacher: teacherName || null,
      metrics,
      scoreData,
      gamesData,
      progressData
    });

  } catch (err) {
    console.error("❌ Error fetching teacher dashboard data:", err);
    res.status(500).json({ message: "Error fetching teacher dashboard data" });
  }
});


// ---------------- Leaderboard Route ----------------
app.get("/api/leaderboard", async (req, res) => {
  try {
    // Fetch all students
    const students = await User.find({ userType: "student" });
    const leaderboard = [];

    for (const student of students) {
      const username = student.username;

      // Get total quiz score
      const quizTotal = (await Score.find({ username })).reduce((sum, s) => sum + s.score, 0);

      // Get total Game1 score
      const game1Total = (await GameScore.find({ username })).reduce((sum, s) => sum + s.score, 0);

      // Get total Game2 score
      const game2Total = (await Game2Score.find({ username })).reduce((sum, s) => sum + s.game2Score, 0);

      // Total combined score
      const totalScore = quizTotal + game1Total + game2Total;

      leaderboard.push({ username, totalScore });
    }

    // Sort by totalScore descending
    leaderboard.sort((a, b) => b.totalScore - a.totalScore);

    // Add rank and badge
    const ranked = leaderboard.slice(0, 50).map((user, idx) => ({
      rank: idx + 1,
      username: user.username,
      totalScore: user.totalScore,
      badge: idx === 0 ? "🥇" : idx === 1 ? "🥈" : idx === 2 ? "🥉" : "",
    }));

    res.json(ranked);
  } catch (err) {
    console.error("❌ Leaderboard error:", err);
    res.status(500).json({ message: "Error fetching leaderboard" });
  }
});
