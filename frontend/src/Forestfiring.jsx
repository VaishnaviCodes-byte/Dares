import React from 'react';
import './Earthquake.css';
import { useTranslation } from 'react-i18next';

function Forestfiring() {
  const { t, i18n } = useTranslation('forestfiring'); // ✅ get current language

  // ✅ Map languages to their respective forest fire videos
  const videoSources = {
    en: '/assets/ForestFire-video.mp4',
    hi: '/assets/ForestFire-hindi.mp4',
    kn: '/assets/ForestFire-video-kan.mp4',
  };

  // ✅ Get current language (fallback to English if not found)
  const currentLang = i18n.language || 'en';
  const videoSrc = videoSources[currentLang] || videoSources.en;

  return (
    <div className="e-container">
      <div className="grid-layout">

        {/* Sidebar Instructions */}
        <aside className="instructions">
          <h2>{t('forestfiring.instructionsTitle')}</h2>

          <div className="step">
            <br />
            <strong>{t('forestfiring.before')}</strong>
            <ul>
              {t('forestfiring.beforeList', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <br />
          </div>

          <div className="step">
            <strong>{t('forestfiring.during')}</strong>
            <ul>
              {t('forestfiring.duringList', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <br />
          </div>

          <div className="step">
            <strong>{t('forestfiring.after')}</strong>
            <ul>
              {t('forestfiring.afterList', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="e-content">

          {/* Video Section */}
          <section className="video-section">
            <h3>{t('forestfiring.videoTitle')}</h3>
            <div className="video-box">
              {/* ✅ Add key={currentLang} so video reloads on language change */}
              <video width="600" controls key={currentLang}>
                <source src={videoSrc} type="video/mp4" />
                {t('forestfiring.videoUnsupported')}
              </video>
            </div>
          </section>

          {/* Safety Kit */}
          <section className="safety-kit">
            <h2>{t('forestfiring.safetyKit')}</h2>
            <div className="kit-items">
              {Object.entries(t('forestfiring.kitItems', { returnObjects: true })).map(([key, value]) => (
                <div className="item" key={key}>
                  <img src={`/assets/${key}.png`} alt={value} />
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Drill Button */}
          <section className="drill-section">
            <button className="drill-btn">{t('forestfiring.startDrill')}</button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Forestfiring;
