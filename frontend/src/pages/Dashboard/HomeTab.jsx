import { AlertTriangle, Phone, Bot } from "lucide-react";
import { POLICE_STATIONS } from "./policeStations";
import "./HomeTab.css";

export default function HomeTab({ dark, contacts, onSOS, onOpenAI }) {
  const cardCls = dark ? "card card-dark" : "card card-light";

  return (
    <div className="tab-content">
      <div className={`${cardCls} status-bar`}>
        <div className="status-dot" />
        <span style={{ fontSize: "0.875rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>
          Protection Active
        </span>
        <span style={{ marginLeft: "auto", fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>
          Location: Sharing
        </span>
      </div>

      <div className={`${cardCls} card-lg sos-section`}>
        <p className="sos-label" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
          Emergency SOS
        </p>
        <button onClick={onSOS} className="sos-btn">
          <div className="sos-ring" />
          <AlertTriangle size={40} color="white" style={{ position: "relative", zIndex: 1, marginBottom: 4 }} />
          <span className="sos-text">SOS</span>
        </button>
        <p className="sos-hint" style={{ color: dark ? "#94a3b8" : "#64748b" }}>
          Tap to alert emergency contacts & authorities
        </p>
      </div>

      <div className="stats-grid">
        {[
          { icon: "📍", label: "Location", val: "Sharing", color: "#4ade80" },
          { icon: "👥", label: "Contacts", val: `${contacts.length} Added`, color: "#60a5fa" },
          { icon: "⭐", label: "Area Rating", val: "4.2 / 5", color: "#fbbf24" },
          { icon: "🛡️", label: "Safe Routes", val: "2 Found", color: "#a78bfa" },
        ].map(s => (
          <div key={s.label} className={`${cardCls} stat-card`}>
            <div className="stat-icon">{s.icon}</div>
            <p className="stat-label" style={{ color: dark ? "#94a3b8" : "#64748b" }}>{s.label}</p>
            <p className="stat-value" style={{ color: s.color }}>{s.val}</p>
          </div>
        ))}
      </div>

      <div className={cardCls}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.75rem" }}>
          <span style={{ fontSize: "1.125rem" }}>👮</span>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>
            Nearby Police Stations
          </p>
        </div>
        {POLICE_STATIONS.map(ps => (
          <div
            key={ps.name}
            className="station-row"
            style={{ background: dark ? "rgba(255,255,255,0.05)" : "rgba(245,243,255,0.6)" }}
          >
            <div>
              <p style={{ fontSize: "0.75rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>{ps.name}</p>
              <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{ps.dist}</p>
            </div>
            <a href={`tel:${ps.phone}`}>
              <div className="call-btn">
                <Phone size={14} color="white" />
              </div>
            </a>
          </div>
        ))}
      </div>

      <button onClick={onOpenAI} className={`${cardCls} ai-quick-card`}>
        <div className="ai-icon-box">
          <Bot size={24} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <p style={{ fontWeight: 600, fontSize: "0.875rem", color: dark ? "white" : "#1e293b" }}>
            HerShield AI Assistant
          </p>
          <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>
            Ask for safety tips, routes & more
          </p>
        </div>
        <div className="ai-chat-badge">Chat →</div>
      </button>
    </div>
  );
}
