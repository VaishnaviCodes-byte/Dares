import React, { useEffect, useRef } from "react";
import "./menu.css";
import { Link } from 'react-router-dom';

function Menu({ isOpen, onClose }) {
  const menuRef = useRef(null);
  const userType = localStorage.getItem("userType");

  const dashboardPath = userType === "teacher" ? "/teacherdashboard" : "/dashboard";
  const addQuizPath = userType === "teacher" ? "/addquiz" : "/quiz";

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        onClose(); // Close menu if clicked outside
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <nav
      ref={menuRef}
      className={`sidebar-fixed ${isOpen ? "open" : "closed"}`}
      role="navigation"
      aria-label="Disaster menu"
    >
      <button className="close-btn" onClick={onClose} aria-label="Close menu">
        ✖
      </button>

      <h2 className="menu-title">🌟 Menu 🌟</h2>

      <ul className="menu-list">
        <Link to="/"><li tabIndex="0">🏠︎ Home </li></Link>
        <Link to={dashboardPath}><li tabIndex="0">📊 Dashboard </li></Link>
        <Link to="/awareness"><li tabIndex="0">🧠 Awareness </li></Link>
        <Link to="/prepardness"><li tabIndex="0">🔒 Preparedness</li></Link>
        <Link to="/response"><li tabIndex="0">🆘 Response </li></Link>
        <Link to="/recovery"><li tabIndex="0">💖 Recovery </li></Link>
        <Link to={addQuizPath}><li tabIndex="0">🎯 Quiz </li></Link>
        <Link to="/games"><li tabIndex="0">🎮 Games </li></Link>
      </ul>
    </nav>
  );
}

export default Menu;
