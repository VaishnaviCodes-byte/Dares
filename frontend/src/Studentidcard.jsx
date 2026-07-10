import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import axios from "axios";
import "./Studentidcard.css";

export default function Studentidcard() {
  const [form, setForm] = useState({
    name: "",
    cls: "",
    roll: "",
    blood: "",
    allergy: "",
    gname: "",
    gphone: "",
    photo: null,
  });

  const [preview, setPreview] = useState(false);

  const username = localStorage.getItem("username"); // logged-in student

  // ---------------- Fetch existing student ID on mount ----------------
  useEffect(() => {
    if (!username) return;

    axios
      .get("http://localhost:5000/studentid", {
        headers: { "x-username": username },
      })
      .then((res) => {
        if (res.data) setForm((prev) => ({ ...prev, ...res.data }));
      })
      .catch(() => console.log("No student ID found. Starting fresh."));
  }, [username]);

  // ---------------- Handlers ----------------
  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhoto = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm((prev) => ({ ...prev, photo: reader.result }));
      reader.readAsDataURL(file);
    }
  };

  const handleGenerate = () => setPreview(true);
  const handlePrint = () => window.print();

  const handleSave = async () => {
  const username = localStorage.getItem("username"); // get logged-in student
  if (!username) return alert("Username missing!");

  try {
   console.log("Sending photo length:", form.photo?.length);
    const res = await axios.post(
      "http://localhost:5000/studentid",  // backend endpoint
      form,                                // student form data
      { headers: { "x-username": username } } // tell backend who is saving
    );

    alert(res.data.message); 
    setForm((prev) => ({ ...prev, ...res.data.student })); // update form after save

  } catch (err) {
    console.error("Error saving student ID:", err.response?.data || err);
    alert("Error saving student ID: " + (err.response?.data?.message || err.message));
  }
};

  // ---------------- QR Code Text ----------------
  const qrText = `Name: ${form.name}
Class: ${form.cls}
Roll: ${form.roll}
Blood: ${form.blood}
Allergies: ${form.allergy}
Guardian: ${form.gname}
Contact: ${form.gphone}`;

  return (
    <div className="page-wrap">
      {/* ---------------- Form Section ---------------- */}
      <div className="card-form">
        <h2>Fill Student Details</h2>

        <label>Student Full Name</label>
        <input id="name" value={form.name} onChange={handleChange} placeholder="e.g., Ananya Sharma" />

        <label>Class / Section</label>
        <input id="cls" value={form.cls} onChange={handleChange} placeholder="e.g., 8A" />

        <label>Roll No.</label>
        <input id="roll" value={form.roll} onChange={handleChange} placeholder="e.g., 24" />

        <div className="row">
          <div style={{ flex: 1 }}>
            <label>Blood Group</label>
            <select id="blood" value={form.blood} onChange={handleChange}>
              <option value="">-- select --</option>
              <option>A+</option>
              <option>A-</option>
              <option>B+</option>
              <option>B-</option>
              <option>O+</option>
              <option>O-</option>
              <option>AB+</option>
              <option>AB-</option>
            </select>
          </div>
          <div style={{ flex: 1 }}>
            <label>Allergies / Medical Info</label>
            <input id="allergy" value={form.allergy} onChange={handleChange} placeholder="e.g., Asthma" />
          </div>
        </div>

        <label>Guardian Name</label>
        <input id="gname" value={form.gname} onChange={handleChange} placeholder="e.g., Mr. Ravi Sharma" />

        <label>Guardian Contact Number</label>
        <input id="gphone" value={form.gphone} onChange={handleChange} placeholder="e.g., +91 98XXXXXXXX" />

        <label>Student Photo</label>
        <input type="file" accept="image/*" onChange={handlePhoto} />

        <div className="btn-row">
          <button className="card-btn" onClick={handleGenerate}>Generate Card</button>
          <button className="card-btn ghost" onClick={handlePrint}>Print Card</button>
          <button className="card-btn ghost" onClick={handleSave}>Save / Update</button>
        </div>
      </div>

      {/* ---------------- Preview Section ---------------- */}
      <div className="preview-wrap">
        <div id="cardPreview" className="id-card">
          <div className="id-header">🌟 SurakshaSet – Student Safety ID Card 🌟</div>
          <div className="school-header">
            <div className="logo">SS</div>
            <div>
              <div className="school-name">Your School Name</div>
              <div className="small">Safety & Emergency ID</div>
            </div>
          </div>

          <div className="card-body">
            <div className="details">
              {["name", "cls", "roll", "blood", "allergy", "gname", "gphone"].map((field) => (
                <React.Fragment key={field}>
                  <div className="k">{field.charAt(0).toUpperCase() + field.slice(1)}:</div>
                  <div className="v">{preview ? form[field] || "—" : "—"}</div>
                </React.Fragment>
              ))}
            </div>
            {form.photo && <img className="photo" src={form.photo} alt="student" />}
          </div>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <h3>QR Code</h3>
          {preview && <QRCode value={qrText} size={200} />}
        </div>
      </div>
    </div>
  );
}
