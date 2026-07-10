import React, { useState } from "react";
import "./Report.css";

function Report() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    location: "",
    disasterType: "",
    description: "",
  });

  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Sending...");

    try {
      const response = await fetch("http://localhost:5000/send-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (data.success) {
        setStatus("✅ Report sent successfully!");
        setFormData({
          name: "",
          email: "",
          location: "",
          disasterType: "",
          description: "",
        });
      } else {
        setStatus("❌ Failed to send report. Try again.");
      }
    } catch (error) {
      console.error(error);
      setStatus("⚠ Error sending report.");
    }
  };

  return (
    <div className="report-app-container">
      <div className="report-form-card">
        <h1>🌍 Disaster Report Form</h1>
        <p className="report-subtitle">
          Help us respond faster by reporting disasters immediately.
        </p>

        <form onSubmit={handleSubmit} className="report-form">
          <input
            type="text"
            name="name"
            placeholder="👤 Your Name"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            name="email"
            placeholder="📧 Your Email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            name="location"
            placeholder="📍 Location"
            value={formData.location}
            onChange={handleChange}
            required
          />
          <select
            name="disasterType"
            value={formData.disasterType}
            onChange={handleChange}
            required
          >
            <option value="">⚠ Select Disaster Type</option>
            <option value="Earthquake">🌋 Earthquake</option>
            <option value="Flood">🌊 Flood</option>
            <option value="Fire">🔥 Fire</option>
            <option value="Cyclone">🌪 Cyclone</option>
          </select>
          <textarea
            name="description"
            placeholder="📝 Describe the situation"
            value={formData.description}
            onChange={handleChange}
            required
          />
          <button type="submit">🚨 Submit Report</button>
        </form>

        <p
          className={`report-status ${
            status.includes("✅")
              ? "report-success"
              : status.includes("❌")
              ? "report-error"
              : "report-info"
          }`}
        >
          {status}
        </p>
      </div>
    </div>
  );
}

export default Report;