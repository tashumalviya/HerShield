import { Shield, Sun, Moon, Bot, LogOut, Menu } from "lucide-react";
import "./Header.css";

export default function Header({ user, dark, onToggleTheme, onOpenAI, onLogout, onOpenSidebar }) {
  return (
    <div className="dashboard-header">
      <div className="header-inner">
        <div className="header-brand">
          {onOpenSidebar && (
            <button
              onClick={onOpenSidebar}
              className="icon-btn"
              style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
              aria-label="Open menu"
            >
              <Menu size={16} color={dark ? "white" : "#1e293b"} />
            </button>
          )}
          <div className="header-logo">
            <Shield size={20} color="white" />
          </div>
          <div>
            <p style={{ fontSize: "0.7rem", color: dark ? "#94a3b8" : "#64748b" }}>
              Hello, {user?.name?.split(" ")[0] || "User"} 👋
            </p>
            <span style={{ fontSize: "1rem", fontWeight: 700, color: dark ? "white" : "#1e293b" }}>
              HerShield
            </span>
          </div>
        </div>
        <div className="header-actions">
          <button onClick={onOpenAI} className="icon-btn ai-btn">
            <Bot size={16} color="white" />
            <span className="online-dot" />
          </button>
          <button
            onClick={onToggleTheme}
            className="icon-btn"
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
          >
            {dark ? <Sun size={16} color="#fcd34d" /> : <Moon size={16} color="#64748b" />}
          </button>
          <button
            onClick={onLogout}
            className="icon-btn"
            style={{ background: dark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.08)" }}
          >
            <LogOut size={16} color={dark ? "white" : "#1e293b"} />
          </button>
        </div>
      </div>
    </div>
  );
}
