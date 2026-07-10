import { useEffect, useRef, useState } from "react";
import "./Chatbot.css";

const ZAPIER_SRC =
    "https://interfaces.zapier.com/assets/web-components/zapier-interfaces/zapier-interfaces.esm.js";
const CHATBOT_ID = "cmfw5yaix001914b37ed1jue9"; // your bot id

export default function ChatbotWidget() {
    const [isOpen, setIsOpen] = useState(false);
    const chatRef = useRef(null);

    // Load Zapier script only once
    useEffect(() => {
        if (!window.zapierInterfacesLoaded) {
            const script = document.createElement("script");
            script.type = "module";
            script.src = ZAPIER_SRC;
            script.async = true;
            script.onload = () => {
                window.zapierInterfacesLoaded = true;
            };
            document.head.appendChild(script);
        }
    }, []);

    // Render chatbot element when popup opens and script is ready
    useEffect(() => {
        if (isOpen && window.zapierInterfacesLoaded && chatRef.current) {
            // Clear any existing children
            chatRef.current.innerHTML = "";

            // Create and append Zapier embed
            const chatbot = document.createElement("zapier-interfaces-chatbot-embed");
            chatbot.setAttribute("chatbot-id", CHATBOT_ID);
            chatbot.setAttribute("is-popup", "false"); // since we control the popup
            chatRef.current.appendChild(chatbot);
        }
    }, [isOpen]);

    return (
        <>
            {/* Floating Button */}
            <div
                className="chatbot-btn"
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                aria-label="Open chatbot"
            >
                <img
                    src="https://cdn-icons-png.flaticon.com/512/4712/4712109.png"
                    alt="Chatbot"
                />
            </div>

            {/* Chat Popup */}
            <div className={`chat-popup ${isOpen ? "active" : ""}`}>
            <div className="chat-header">
                <span className="chat-title">SurakshaSetu Chatbot</span>
                <button onClick={() => setIsOpen(false)}>&times;</button>
            </div>
            <div className="chat-content" ref={chatRef}>
                {isOpen && !window.zapierInterfacesLoaded && (
                    <div className="chat-loading">Loading chatbot...</div>
                )}
            </div>
        </div >
    </>
  );
}