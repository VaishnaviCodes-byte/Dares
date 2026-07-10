import React from "react";
import "./Preparedness.css";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Preparedness() {
  const { t } = useTranslation("preparedness");

  return (
    <div className="ep-container">
      {/* Page Title */}
      <h2 className="ep-subtitle">{t("subtitle")}</h2>
      <h3 className="ep-emergency-title">{t("emergencyTitle")}</h3>

      {/* Emergency Contacts */}
      <div className="ep-card">
        <div className="ep-contacts">
          <div className="ep-contact" id="fire-ep">
            <a href="tel:101">
              <img
                src="https://img.icons8.com/color/96/fire-truck.png"
                alt="Fire Truck"
              />
              <br />
              {t("fire")}
            </a>
          </div>

          <div className="ep-contact" id="ambulance-ep">
            <a href="tel:102">
              <img
                src="https://img.icons8.com/color/96/ambulance.png"
                alt="Ambulance"
              />
              <br />
              {t("ambulance")}
            </a>
          </div>

          <div className="ep-contact" id="police-ep">
            <a href="tel:100">
              <img
                src="https://img.icons8.com/color/96/policeman-male.png"
                alt="Police"
              />
              <br />
              {t("police")}
            </a>
          </div>
        </div>
      </div>

      {/* Safety Checklist */}
      <div className="ep-card ep-safety-section">
        <div className="ep-checklist">
          <h4>{t("checklistTitle")}</h4>
          {t("checklist", { returnObjects: true }).map((item, idx) => (
            <p key={idx}>{item}</p>
          ))}
        </div>

        {/* Evacuation Map */}
        <Link to="/safetymap">
          <div className="ep-evacuation">
            <a
              href="https://www.google.com/maps"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="assets/map.png" alt="Evacuation Map" />
              <br />
              {t("evacuationMap")}
            </a>
          </div>
        </Link>
      </div>

      {/* Note */}
      <div className="ep-note">{t("note")}</div>
    </div>
  );
}

export default Preparedness;
