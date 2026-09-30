import { useState, useRef, useEffect } from "react";
import { Bot, X, Send } from "lucide-react";
import { AI_RESPONSES, getAIResponse } from "./aiResponses";
import "./AIChat.css";

export default function AIChat({ open, closing, dark, onClose }) {
  const [messages, setMessages] = useState([{ role: "ai", text: AI_RESPONSES.default }]);
  const [aiInput, setAiInput] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  if (!open) return null;

  const sendAI = () => {
    if (!aiInput.trim()) return;
    const msg = aiInput.trim();
    setAiInput("");
    setMessages(m => [...m, { role: "user", text: msg }]);
    setAiLoading(true);
    setTimeout(() => {
      setMessages(m => [...m, { role: "ai", text: getAIResponse(msg) }]);
      setAiLoading(false);
    }, 900);
  };

  return (
    <>
      <div className="ai-backdrop" onClick={onClose} />
      <div className={`ai-panel ${dark ? "ai-panel-dark" : "ai-panel-light"} ${closing ? "closing" : ""}`}>
        <div className={`ai-panel-header ${dark ? "divider-dark" : "divider-light"}`}>
          <div className="ai-header-icon">
            <Bot size={20} color="white" />
          </div>
          <div style={{ flex: 1 }}>
            <p style={{ fontWeight: 700, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>
              HerShield AI
            </p>
            <div className="ai-online-row">
              <div className="ai-online-dot" />
              <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>
                Online · English / हिंदी
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className={`close-btn ${dark ? "close-btn-dark" : "close-btn-light"}`}
          >
            <X size={16} color={dark ? "white" : "#1e293b"} />
          </button>
        </div>

        <div
          className={`quick-prompts ${dark ? "divider-dark" : "divider-light"}`}
          style={{ borderBottom: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #f5f3ff" }}
        >
          {["SOS help", "Safe route", "Safety tip", "Hindi", "What can you do"].map(p => (
            <button
              key={p}
              onClick={() => setAiInput(p)}
              className={`quick-prompt-btn ${dark ? "quick-prompt-dark" : "quick-prompt-light"}`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="chat-messages">
          {messages.map((m, i) => (
            <div key={i} className={`chat-msg ${m.role}`}>
              {m.role === "ai" && (
                <div className="chat-avatar">
                  <Bot size={14} color="white" />
                </div>
              )}
              <div className={`chat-bubble ${m.role === "user" ? "user" : dark ? "ai-dark" : "ai-light"}`}>
                {m.text}
              </div>
            </div>
          ))}
          {aiLoading && (
            <div className="chat-msg ai">
              <div className="chat-avatar">
                <Bot size={14} color="white" />
              </div>
              <div
                className={`typing-indicator ${dark ? "card-dark" : ""}`}
                style={!dark ? { background: "#f5f3ff", border: "1px solid #ede9fe" } : {}}
              >
                <div className="typing-dot" />
                <div className="typing-dot" />
                <div className="typing-dot" />
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        <div
          className="chat-input-area"
          style={{
            borderTop: dark ? "1px solid rgba(255,255,255,0.1)" : "1px solid #ede9fe",
            background: dark ? "#1a0d30" : "white",
          }}
        >
          <div className={`chat-input-row ${dark ? "chat-input-row-dark" : "chat-input-row-light"}`}>
            <input
              type="text"
              value={aiInput}
              onChange={e => setAiInput(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendAI()}
              placeholder="Ask anything about safety…"
              className={`chat-input ${dark ? "chat-input-dark" : "chat-input-light"}`}
            />
            <button onClick={sendAI} className="send-btn">
              <Send size={14} color="white" />
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
