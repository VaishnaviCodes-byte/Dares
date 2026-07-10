import React from 'react';
import './Earthquake.css';
import { useTranslation } from 'react-i18next';

function Flood() {
  const { t, i18n } = useTranslation('flood'); // ✅ get current language

  // ✅ Map languages to their respective flood videos
  const videoSources = {
    en: '/assets/Flood-video.mp4',
    hi: '/assets/Flood-video-hindi.mp4',
    kn: '/assets/Flood-video-kan.mp4',
  };

  // ✅ Get current language (fallback to English)
  const currentLang = i18n.language || 'en';
  const videoSrc = videoSources[currentLang] || videoSources.en;

  return (
    <div className="e-container">
      <div className="grid-layout">

        {/* Sidebar Instructions */}
        <aside className="instructions">
          <h2>{t('flood.instructionsTitle')}</h2>

          <div className="step">
            <br />
            <strong>{t('flood.before')}</strong>
            <ul>
              {t('flood.beforeList', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <br />
          </div>

          <div className="step">
            <strong>{t('flood.during')}</strong>
            <ul>
              {t('flood.duringList', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
            <br />
          </div>

          <div className="step">
            <strong>{t('flood.after')}</strong>
            <ul>
              {t('flood.afterList', { returnObjects: true }).map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="e-content">

          {/* Video Section */}
          <section className="video-section">
            <h3>{t('flood.videoTitle')}</h3>
            <div className="video-box">
              {/* ✅ Add key={currentLang} so video reloads on language change */}
              <video width="600" controls key={currentLang}>
                <source src={videoSrc} type="video/mp4" />
                {t('flood.videoUnsupported')}
              </video>
            </div>
          </section>

          {/* Safety Kit */}
          <section className="safety-kit">
            <h2>{t('flood.safetyKit')}</h2>
            <div className="kit-items">
              {Object.entries(t('flood.kitItems', { returnObjects: true })).map(([key, value]) => (
                <div className="item" key={key}>
                  <img src={`/assets/${key}.png`} alt={value} />
                  <p>{value}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Drill Button */}
          <section className="drill-section">
            <button className="drill-btn">{t('flood.startDrill')}</button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Flood;
