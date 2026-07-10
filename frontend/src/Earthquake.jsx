import './disasters.css';
import { useTranslation } from "react-i18next";

function Earthquake() {
  const { t, i18n } = useTranslation("earthquake"); // get i18n to read current language

  // Map your language codes to the corresponding video file
  const videoSources = {
    en: "/assets/Earthquake-video.mp4",
    hi: "/assets/Earthquake-video-hindi.mp4",
    kn: "/assets/Earthquake-video-kan.mp4",
  };

  // Get current language (fallback to English if not available)
  const currentLang = i18n.language || "en";
  const videoSrc = videoSources[currentLang] || videoSources.en;

  return (
    <div className="e-container">
      <div className="grid-layout">

        {/* Sidebar Instructions */}
        <aside className="instructions">
          <h2>⚠ {t("instructions")}</h2>

          <div className="step">
            <br />
            <strong>{t("before")}</strong>
            <ul>
              <li>{t("beforeItem1")}</li>
              <li>{t("beforeItem2")}</li>
              <li>{t("beforeItem3")}</li>
            </ul>
            <br />
          </div>

          <div className="step">
            <strong>{t("during")}</strong>
            <ul>
              <li>{t("duringItem1")}</li>
              <li>{t("duringItem2")}</li>
              <li>{t("duringItem3")}</li>
            </ul>
            <br />
          </div>

          <div className="step">
            <strong>{t("after")}</strong>
            <ul>
              <li>{t("afterItem1")}</li>
              <li>{t("afterItem2")}</li>
              <li>{t("afterItem3")}</li>
            </ul>
          </div>
        </aside>

        {/* Main Content */}
        <main className="e-content">

          {/* Video Section */}
          <section className="video-section">
            <h3>{t("videoTitle")}</h3>
            <div className="video-box">
              <video width="600" controls key={currentLang}>
                <source src={videoSrc} type="video/mp4" />
                {t("videoUnsupported")}
              </video>
            </div>
          </section>

          {/* Safety Kit */}
          <section className="safety-kit">
            <h2>{t("safetyKit")}</h2>
            <div className="kit-items">
              <div className="item">
                <img src="assets/firstAid.png" alt={t("firstAid")} />
                <p>{t("firstAid")}</p>
              </div>
              <div className="item">
                <img src="assets/torch.png" alt={t("torch")} />
                <p>{t("torch")}</p>
              </div>
              <div className="item">
                <img src="assets/bottle.png" alt={t("bottle")} />
                <p>{t("bottle")}</p>
              </div>
              <div className="item">
                <img src="assets/can.png" alt={t("food")} />
                <p>{t("food")}</p>
              </div>
              <div className="item">
                <img src="assets/mobile.png" alt={t("mobile")} />
                <p>{t("mobile")}</p>
              </div>
              <div className="item">
                <img src="assets/clothes.png" alt={t("clothes")} />
                <p>{t("clothes")}</p>
              </div>
              <div className="item">
                <img src="assets/documents.png" alt={t("documents")} />
                <p>{t("documents")}</p>
              </div>
              <div className="item">
                <img src="assets/rope.png" alt={t("rope")} />
                <p>{t("rope")}</p>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}

export default Earthquake;
