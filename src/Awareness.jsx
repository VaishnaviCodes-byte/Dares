import React, { useState } from 'react';
import './Awareness.css';
import Menu from './menu';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Awareness() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation('awareness');

  return (
    <div className="main">
      <h1 className="title">{t("title")}</h1>

      {/* Main Content */}
      <div className="main-content">
        {/* Disaster Cards */}
        <div className="grid">
          <Link to='/earthquake'>
            <div className='card animated-card'>
              <img src="/assets/Earthquake.png" alt="" />
              <h3>{t("earthquake.title")}</h3>
              <p>{t("earthquake.desc")}</p>
            </div>
          </Link>
          <Link to="/landslide">
            <div className='card animated-card'>
              <img src="/assets/landslide.png" alt="" />
              <h3>{t("landslide.title")}</h3>
              <p>{t("landslide.desc")}</p>
            </div>
          </Link>
          <Link to="/flood">
            <div className='card animated-card'>
              <img src="/assets/flood.png" alt="" />
              <h3>{t("flood.title")}</h3>
              <p>{t("flood.desc")}</p>
            </div>
          </Link>
          <Link to="/forestfiring">
            <div className='card animated-card'>
              <img src="/assets/forestfire.png" alt="" />
              <h3>{t("forestfire.title")}</h3>
              <p>{t("forestfire.desc")}</p>
            </div>
          </Link>
        </div>

        {/* Awareness Section */}
        <div className="awareness">
          <img src="/assets/kids.png" alt="kids" className="kids" />
          <div className="awareness-box">{t("awarenessBox")}</div>
        </div>
      </div>
    </div>
  );
}

export default Awareness;