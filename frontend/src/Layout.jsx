import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import Menu from "./menu";
import "./Layout.css";
import { useTranslation } from "react-i18next";
import ChatbotWidget from "./Chatbot";
import WeatherApp from "./Weather";

function Layout() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  // Use the "layout" namespace for Header & Footer
  const { i18n, t } = useTranslation("layout");

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng); // global change
    setShowLangMenu(false);    // close dropdown after selection
  };

  // ✅ Get current route
  const location = useLocation();
  const hideHeaderFooter = location.pathname === "/safetymap";

  return (
    <div className="main">
      {/* Header - hidden on /safetymap */}
      {!hideHeaderFooter && (
        <header className="header">
          <span className="menu2" onClick={() => setIsMenuOpen(true)}>
            <img src="/assets/menu2.png" alt="menu" />
          </span>

          <span className="logo-main"><img src="assets/logo.png" alt="" /></span>
          <div className="layout-icons">
                
                <Link to={"/studentidcard"}>
                <img src="assets/id.png" alt="" />
                </Link>
                <Link to={"/safetymap"}>
                  <img src="assets/map2.png" alt="Evacuation map" />
                </Link>
               
              </div>

          {/* Globe + Language Dropdown */}
          <div className="globe-container">
            <span
              className="globe2"
              onClick={() => setShowLangMenu(!showLangMenu)}
              style={{ cursor: "pointer" }}
            >
              <img src="/assets/globe.png" alt="globe" /> 
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
      )}

      {/* Sidebar Menu */}
      <Menu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* Main Content */}
      <main className="page-content">
        <Outlet />
      </main>

      {/* Footer - hidden on /safetymap */}
      {!hideHeaderFooter && (
        <footer className="footer">
          <a href="tel:+917259617986">{t("footerContact")}</a>
        </footer>
      )}

      <ChatbotWidget />
      <WeatherApp />
    </div>
  );
}

export default Layout;
