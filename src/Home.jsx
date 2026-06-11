import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useTranslation } from "react-i18next";

function Home() {
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Specify the "home" namespace
  const { t, i18n } = useTranslation("home");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    setShowLangMenu(false); // close menu after selection
  };

  return (
    <div className="container">
      {/* Header */}
      <header className="head">
        
        <div className='homehead'>
          <img src="assets/logo.png" alt="" />
        
        </div>
        <h4 className="slogan">“{t("slogan")}”</h4>
        

        {/* Globe with dropdown */}
        <div className="globe-container">
          <span className="globe" onClick={() => setShowLangMenu(!showLangMenu)} style={{ cursor: "pointer" }}>
            <img src="/assets/globe.png" alt="Globe" />
          </span>

          {showLangMenu && (
            <div className="language-menu">
              <button onClick={() => changeLanguage("en")}>English</button>
              <button onClick={() => changeLanguage("hi")}>हिन्दी</button>
              <button onClick={() => changeLanguage("kn")}>ಕನ್ನಡ</button>
            </div>
          )}
        </div>
      </header>


      {/* Main content */}
      <div className="content">
        <div className="image-section">
          <img src="/assets/board.png" alt={t("ready")} className="bg-image" />
        </div>
        <div className="text-section">
          <h2>{t("title")}</h2>
          <p>{t("description")}</p>
          <Link to="/loginSignup">
            <button className="btn">{t("getStarted")} &gt;&gt;</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Home;
