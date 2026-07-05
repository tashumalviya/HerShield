import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../../context/AppContext";
import axios from "axios";
import "./Dashboard.css";

import Header from "./Header.jsx";
import Slidebar from "./Slidebar.jsx";
import HomeTab from "./HomeTab.jsx";
import MapTab from "./MapTab.jsx";
import ContactsTab from "./ContactsTab.jsx";
import FeedbackTab from "./FeedbackTab.jsx";
import AIChat from "./AIChat.jsx";
import BottomNav from "./BottomNav.jsx";
import { SOSOverlay, FloatingSOS } from "./SOS.jsx";

export default function Dashboard() {
  const { theme, toggleTheme, user } = useApp();
  const navigate = useNavigate();
  const dark = theme === "dark" || false;

  const [tab, setTab] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiClosing, setAiClosing] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);

  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(3);
  const [userLocation, setUserLocation] = useState(null);

  const [contacts, setContacts] = useState([]);

  const { setUser } = useApp();
  const closeAI = () => {
    setAiClosing(true);
    setTimeout(() => {
      setAiOpen(false);
      setAiClosing(false);
    }, 240);
  };

  const goTab = (id) => {
    setTab(id);
    setSideOpen(false);
  };

const handleLogout = () => {
  localStorage.clear();
  setUser(null);
  window.location.href = "/login";
};

const handleDelete = async () => {

  const user = JSON.parse(localStorage.getItem("user"));

  if (!window.confirm("Delete your account? This cannot be undone."))
    return;

  try {

    const res = await axios.delete(
      `https://hershield-r3b1.onrender.com/api/auth/delete/${user.id}`
    );

    alert(res.data.message);

    localStorage.clear();

    window.location.href = "/login";

  } catch (err) {

    console.log(err);

    alert(err.response?.data?.message || "Delete Failed");

  }

};

  const handleSOS = () => {
    setSosActive(true);
    setSosCountdown(3);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const user = JSON.parse(localStorage.getItem("user"));
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const locationLink = `https://maps.google.com/?q=${lat},${lng}`;
        setUserLocation(locationLink);
        console.log("SOS Location:", locationLink);

        try {
          await fetch("https://hershield-r3b1.onrender.com/api/tracking/start", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, latitude: lat, longitude: lng }),
          });

          const response = await fetch("https://hershield-r3b1.onrender.com/api/sos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: user.id, latitude: lat, longitude: lng }),
          });
          const data = await response.json();
          console.log("SOS Response:", data);

          if (window.liveTracking) clearInterval(window.liveTracking);
          window.liveTracking = setInterval(() => {
            navigator.geolocation.getCurrentPosition(
              async (pos) => {
                await fetch("https://hershield-r3b1.onrender.com/api/tracking/update", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    user_id: user.id,
                    latitude: pos.coords.latitude,
                    longitude: pos.coords.longitude,
                  }),
                });
                console.log("Location Updated:", pos.coords.latitude, pos.coords.longitude);
              },
              (err) => console.log(err)
            );
          }, 10000);
        } catch (err) {
          console.error("SOS Error:", err);
          alert("Failed to send SOS.");
        }
      },
      (error) => {
        console.error("Location Error:", error);
        alert("Please enable location services.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    let c = 3;
    const t = setInterval(() => {
      c--;
      setSosCountdown(c);
      if (c <= 0) clearInterval(t);
    }, 1000);
  };

  const cancelSOS = () => {
    if (window.liveTracking) {
      clearInterval(window.liveTracking);
      window.liveTracking = null;
    }
    setSosActive(false);
    setSosCountdown(3);
  };

  const bg = dark
    ? "linear-gradient(135deg,#0f0a1e 0%,#1a0533 50%,#0a1020 100%)"
    : "linear-gradient(135deg,#f5f3ff 0%,#ede9fe 40%,#e0f2fe 100%)";

  return (
    <div className="dashboard" style={{ background: bg }}>
      <SOSOverlay
        active={sosActive}
        countdown={sosCountdown}
        contactsCount={contacts.length}
        userLocation={userLocation}
        onCancel={cancelSOS}
      />

      <AIChat open={aiOpen} closing={aiClosing} dark={dark} onClose={closeAI} />

      {/* Background orbs */}
      <div className="orb orb-top" style={{ opacity: dark ? 0.1 : 0.2 }} />
      <div className="orb orb-bottom" style={{ opacity: dark ? 0.1 : 0.15 }} />

      <Header
        user={user}
        dark={dark}
        onToggleTheme={toggleTheme}
        onOpenAI={() => setAiOpen(true)}
        onLogout={handleLogout}
        onOpenSidebar={() => setSideOpen(true)}
      />

     <Slidebar
  open={sideOpen}
  onClose={() => setSideOpen(false)}
  user={user}
  tab={tab}
  goTab={goTab}
  onLogout={handleLogout}
  onDelete={handleDelete}
/>

      <div className="dashboard-content">
        {tab === "home" && (
          <HomeTab
            dark={dark}
            contacts={contacts}
            onSOS={handleSOS}
            onOpenAI={() => setAiOpen(true)}
          />
        )}
        {tab === "map" && <MapTab dark={dark} />}
        {tab === "contacts" && (
          <ContactsTab dark={dark} contacts={contacts} setContacts={setContacts} />
        )}
        {tab === "feedback" && <FeedbackTab dark={dark} />}
      </div>

      <FloatingSOS onClick={handleSOS} />

      <BottomNav
        tab={tab}
        setTab={setTab}
        aiOpen={aiOpen}
        onOpenAI={() => setAiOpen(true)}
        dark={dark}
      />
    </div>
  );
}
