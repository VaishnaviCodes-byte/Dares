import React from 'react';
import './disasters.css';
import './Landslide.css';
import { useTranslation } from 'react-i18next';

function Landslide() {
  const { t, i18n } = useTranslation('landslide'); // ✅ get i18n for current language

  // ✅ Map languages to their respective landslide videos
  const videoSources = {
    en: '/assets/Landslide-video.mp4',
    hi: '/assets/Landslide-video-hinid.mp4',
    kn: '/assets/Landslide-video-kan.mp4',
  };

  // ✅ Get current language (fallback to English if missing)
  const currentLang = i18n.language || 'en';
  const videoSrc = videoSources[currentLang] || videoSources.en;

  return (
    <div className="e-container L-container">
      {/* Grid Layout */}
      <div className="grid-layout">

        {/* Sidebar Instructions */}
        <aside className="instructions">
          <h2>{t('landslide.instructionsTitle')}</h2>

          {/* Before */}
          <div className="step">
            <br />
            <strong>{t('landslide.before')}</strong>
            <ul>
              {t('landslide.beforeList', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <br />
          </div>

          {/* During */}
          <div className="step">
            <strong>{t('landslide.during')}</strong>
            <ul>
              {t('landslide.duringList', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
            <br />
          </div>

          {/* After */}
          <div className="step">
            <strong>{t('landslide.after')}</strong>
            <ul>
              {t('landslide.afterList', { returnObjects: true }).map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="e-content">

          {/* Video Section */}
          <section className="video-section L-ani" id="landslide-video">
            <h3>{t('landslide.videoTitle')}</h3>
            <div className="video-box ani">
              {/* ✅ Use key={currentLang} to reload video when language changes */}
              <video width="500" controls key={currentLang}>
                <source src={videoSrc} type="video/mp4" />
                {t('landslide.videoUnsupported')}
              </video>
            </div>
          </section>

          {/* Safety Kit */}
          <section className="safety-kit" id="landslide-safety">
            <h2>{t('landslide.safetyKit')}</h2>
            <div className="kit-items">
              <div className="item">
                <img src="assets/helmet.png" alt="Helmet" />
                <p>{t('landslide.kitItems.helmet')}</p>
              </div>
              <div className="item">
                <img src="assets/torch.png" alt="Torch" />
                <p>{t('landslide.kitItems.torch')}</p>
              </div>
              <div className="item">
                <img src="assets/firstAid.png" alt="First Aid Kit" />
                <p>{t('landslide.kitItems.firstAid')}</p>
              </div>
              <div className="item">
                <img src="assets/rope.png" alt="Rope" />
                <p>{t('landslide.kitItems.rope')}</p>
              </div>
              <div className="item">
                <img src="assets/clothes.png" alt="Raincoat" />
                <p>{t('landslide.kitItems.raincoat')}</p>
              </div>
              <div className="item">
                <img src="assets/medicine.png" alt="Medicine" />
                <p>{t('landslide.kitItems.medicine')}</p>
              </div>
              <div className="item">
                <img src="assets/fruits.png" alt="Fruits" />
                <p>{t('landslide.kitItems.fruits')}</p>
              </div>
            </div>
          </section>

          {/* Drill Button */}
          <section className="drill-section">
            <button className="drill-btn">{t('landslide.startDrill')}</button>
          </section>
        </main>
      </div>
    </div>
  );
}

export default Landslide;
