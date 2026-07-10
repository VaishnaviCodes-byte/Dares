import React from "react";
import { Link } from "react-router-dom";
import "./Recovery.css";
import { useTranslation } from "react-i18next";


function Recovery() {
  const { t } = useTranslation("recovery");

  return (
    <div className="recovery-container">
      <main className="main-section2">
        {/* Left Character */}
        <div className="character left">
          <div id="fact">
            <img src="/assets/speech-bubble.png" alt="Speech Bubble" />
            <p>{t("fact")}</p>
          </div>
          <img src="/assets/boy.png" alt="Boy" />
        </div>

        {/* Content */}
        <div className="content-box">
          <h2>{t("title")}</h2>

          <div className="card-grid2">
            {/* First Aid */}
            <div className="card-res red">
              <div className="icon">🚑</div>
              <h3>{t("firstAidTitle")}</h3>
              <ul>
                {t("firstAidList", { returnObjects: true }).map((item, idx) => (
                  <li key={idx}>{item}</li>
                ))}
              </ul>
            </div>

            {/* Support */}
            <div className="card-res green">
              <div className="icon">🤝</div>
              <h3>{t("supportTitle")}</h3>
              <p>{t("supportText")}</p>
            </div>

            {/* Danger */}
            <div className="card-res yellow">
              <div className="icon">⚠</div>
              <h3>{t("dangerTitle")}</h3>
              <p>{t("dangerText")}</p>
            </div>

            {/* Emotional */}
            <div className="card-res blue">
              <div className="icon">❤</div>
              <h3>{t("emotionalTitle")}</h3>
              <p>{t("emotionalText")}</p>
            </div>
          </div>

          <Link to={"/report"}><button className="report-btn">{t("reportButton")}</button></Link>
        </div>

        {/* Right Character */}
        <div className="character right">
          <div id="fact2">
            <img src="/assets/speech-bubble 2.png" alt="Speech Bubble" />
            <p>{t("fact2")}</p>
          </div>
          <img src="/assets/girl.png" alt="Girl" />
        </div>
      </main>
    </div>
  );
}

export default Recovery;
