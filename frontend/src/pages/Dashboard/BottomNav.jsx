import { Home, Map, Users, Star, Bot } from "lucide-react";
import "./BottomNav.css";

export default function BottomNav({ tab, setTab, aiOpen, onOpenAI, dark }) {
  return (
    <div className={`bottom-nav ${dark ? "bottom-nav-dark" : "bottom-nav-light"}`}>
      <div className="bottom-nav-inner">
        {[
          { id: "home", Icon: Home, label: "Home" },
          { id: "map", Icon: Map, label: "Map" },
          { id: "contacts", Icon: Users, label: "Contacts" },
          { id: "feedback", Icon: Star, label: "Feedback" },
        ].map(({ id, Icon, label }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`nav-btn ${tab === id ? "active" : dark ? "nav-btn-dark" : "nav-btn-light"}`}
          >
            <Icon size={20} />
            <span className="nav-label">{label}</span>
          </button>
        ))}
        <button
          onClick={onOpenAI}
          className={`nav-btn ${aiOpen ? "active" : dark ? "nav-btn-dark" : "nav-btn-light"}`}
        >
          <Bot size={20} />
          <span className="nav-label">AI</span>
          <span className="nav-online-dot" />
        </button>
      </div>
    </div>
  );
}
