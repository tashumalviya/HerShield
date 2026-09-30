import { X, User, Home, Users, Star, LogOut, Trash } from "lucide-react";
import "./Slidebar.css";

export default function Slidebar({
  open,
  onClose,
  user,
  tab,
  goTab,
  onLogout,
  onDelete,
}) {
  return (
    <>
      {open && <div className="side-backdrop" onClick={onClose} />}
      <aside className={`side-drawer ${open ? "open" : ""}`} aria-hidden={!open}>
        <div className="side-header">
          <div className="side-avatar">{(user?.name?.[0] || "U").toUpperCase()}</div>
          <div className="side-id">
            <p className="side-name">{user?.name || "User"}</p>
            <p className="side-phone">{user?.phone ? `+91 ${user.phone}` : "Welcome"}</p>
          </div>
          <button className="side-close" onClick={onClose} aria-label="Close menu">
            <X size={18} />
          </button>
        </div>
        <nav className="side-nav">
          {[
            { id: "profile", icon: User, label: "My Profile", action: onClose },
            { id: "home", icon: Home, label: "Home", action: () => goTab("home") },
            { id: "contacts", icon: Users, label: "Saved Contacts", action: () => goTab("contacts") },
            { id: "feedback", icon: Star, label: "Your Feedback", action: () => goTab("feedback") },
          ].map(({ id, icon: Icon, label, action }) => (
            <button
              key={id}
              onClick={action}
              className={`side-item ${tab === id ? "active" : ""}`}
            >
              <Icon size={18} /> <span>{label}</span>
            </button>
          ))}
          <div className="side-divider" />
          <button onClick={onLogout} className="side-item">
            <LogOut size={18} /> <span>Logout</span>
          </button>
          <button onClick={onDelete} className="side-item danger">
            <Trash size={18} /> <span>Delete Account</span>
          </button>
        </nav>
      </aside>
    </>
  );
}
