import React from "react";
import "./Response.css";
import { useTranslation } from "react-i18next";

function Response() {
  const { t } = useTranslation("response");

  return (
    <div className="disaster-guide">
      {/* Left Vertical Flow */}
      <div className="flow-chart">
        <div className="floe">
          <div className="flow-box yellow">{t("flow.step1")}</div>
          <div className="arrow">↓</div>
          <div className="flow-box blue">{t("flow.step2")}</div>
          <div className="arrow">↓</div>
          <div className="flow-box green">{t("flow.step3")}</div>
        </div>
      </div>

      {/* Main Content */}
      <div className="content-resp">
        {/* Title Row */}
        <div className="title-row">
          <h2>{t("title")}</h2>
          <div className="sos-btn">
            <a href="tel:+917259617986">
              <img src="assets/sos-btn.png" alt="Call Us" />
            </a>
          </div>
        </div>

        {/* Cards Section */}
        <div className="cards-resp">
          {/* Do's */}
          <div className="card-resp green-card-resp">
            <h3>{t("dosTitle")}</h3>
            <ul>
              {t("dosList", { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <img src="assets/boy2.0.png" alt="Boy Cartoon" className="boy-img" />
          </div>

          {/* Don'ts */}
          <div className="card-resp red-card-resp">
            <h3>{t("dontsTitle")}</h3>
            <ul>
              {t("dontsList", { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <img src="assets/girl2.0.png" alt="Girl Cartoon" className="girl-img" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Response;
