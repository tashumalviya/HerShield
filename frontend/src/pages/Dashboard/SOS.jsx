import { AlertTriangle } from "lucide-react";
import "./SOS.css";

export function SOSOverlay({ active, countdown, contactsCount, userLocation, onCancel }) {
  if (!active) return null;
  return (
    <div className="sos-overlay">
      {countdown > 0 ? (
        <>
          <div className="sos-countdown">{countdown}</div>
          <p style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            SOS Alert Sending…
          </p>
          <p style={{ color: "#fca5a5", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Notifying your emergency contacts
          </p>
          <button onClick={onCancel} className="sos-cancel-btn">
            Cancel
          </button>
        </>
      ) : (
        <>
          <div className="sos-sent-icon">🚨</div>
          <p style={{ color: "white", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            SOS Alert Sent!
          </p>
          <p style={{ color: "#fca5a5", fontSize: "0.875rem", marginBottom: "0.5rem" }}>
            Location shared with {contactsCount} contacts
          </p>
          {userLocation && (
            <a
              href={userLocation}
              target="_blank"
              rel="noreferrer"
              style={{ color: "#60a5fa", fontSize: "0.85rem", textDecoration: "underline" }}
            >
              View My Location
            </a>
          )}
          <p style={{ color: "#fca5a5", fontSize: "0.875rem", marginBottom: "2rem" }}>
            Emergency services notified
          </p>
          <button onClick={onCancel} className="sos-cancel-btn">
            I'm Safe Now
          </button>
        </>
      )}
    </div>
  );
}

export function FloatingSOS({ onClick }) {
  return (
    <button onClick={onClick} className="floating-sos">
      <div className="floating-sos-ring" />
      <AlertTriangle size={24} color="white" style={{ position: "relative", zIndex: 1 }} />
    </button>
  );
}
