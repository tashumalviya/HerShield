import { useState } from "react";
import CurrentLocationMap from "../CurrentLocationMap.jsx";
import { POLICE_STATIONS } from "./policeStations";
import "./MapTab.css";

export default function MapTab({ dark }) {
  const [selectedRoute, setSelectedRoute] = useState("safe");
  const cardCls = dark ? "card card-dark" : "card card-light";

  return (
    <div className="tab-content">
      <h2 style={{ fontWeight: 700, fontSize: "1.125rem", color: dark ? "white" : "#1e293b" }}>
        Live Map
      </h2>

      <div className={cardCls} style={{ borderRadius: "1.5rem", overflow: "hidden", padding: 0 }}>
        <div
          className="map-container"
          style={{
            background: dark
              ? "linear-gradient(135deg,#1a2535,#0f1f30)"
              : "linear-gradient(135deg,#e8f4e8,#d4ecd4)",
          }}
        >
          <CurrentLocationMap />
          <div className="map-location-pin">
            <div className="location-dot">
              <div style={{ width: "0.75rem", height: "0.75rem", borderRadius: "50%", background: "white" }} />
            </div>
          </div>
        </div>

        <div style={{ padding: "1rem" }}>
          <p
            style={{
              fontSize: "0.65rem",
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              color: dark ? "#94a3b8" : "#64748b",
              marginBottom: "0.75rem",
            }}
          >
            Route Preference
          </p>
          <div className="route-options">
            {[
              { id: "safe", label: "🛡️ Safest Route", desc: "8 min longer" },
              { id: "fast", label: "⚡ Fastest Route", desc: "Moderate safety" },
            ].map(r => (
              <button
                key={r.id}
                onClick={() => setSelectedRoute(r.id)}
                className="route-option"
                style={{
                  background:
                    selectedRoute === r.id
                      ? dark ? "rgba(139,92,246,0.25)" : "#f5f3ff"
                      : dark ? "rgba(255,255,255,0.05)" : "#f8fafc",
                  borderColor:
                    selectedRoute === r.id
                      ? dark ? "#a78bfa" : "#8b5cf6"
                      : dark ? "rgba(255,255,255,0.1)" : "#e2e8f0",
                }}
              >
                <p style={{ fontSize: "0.75rem", fontWeight: 600, color: dark ? "white" : "#1e293b" }}>
                  {r.label}
                </p>
                <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{r.desc}</p>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={cardCls}>
        <p
          style={{
            fontWeight: 600,
            fontSize: "0.875rem",
            color: dark ? "white" : "#1e293b",
            marginBottom: "0.75rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
          }}
        >
          <span>👮</span> Nearby Police Stations
        </p>
        {POLICE_STATIONS.map(ps => (
          <div
            key={ps.name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "0.75rem",
              padding: "0.75rem",
              borderRadius: "0.75rem",
              marginBottom: "0.5rem",
              background: dark ? "rgba(255,255,255,0.05)" : "rgba(245,243,255,0.6)",
            }}
          >
            <div className="station-icon">👮</div>
            <div style={{ flex: 1 }}>
              <p style={{ fontSize: "0.75rem", fontWeight: 500, color: dark ? "white" : "#1e293b" }}>{ps.name}</p>
              <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>{ps.dist} away</p>
            </div>
            <a href={`tel:${ps.phone}`} className="call-pill">Call</a>
          </div>
        ))}
      </div>
    </div>
  );
}
