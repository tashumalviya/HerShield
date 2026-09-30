import { useState, useEffect, useRef } from "react";
import { useUser, useClerk } from "@clerk/clerk-react";
import { toast } from "react-toastify";
import { useApp } from "../../context/AppContext";
import { useApi } from "../../api";
import { sendSosEmails } from "../../emailjs";
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

const getPos = () =>
  new Promise((res, rej) =>
    navigator.geolocation.getCurrentPosition(res, rej, { enableHighAccuracy: true, timeout: 10000 })
  );

export default function Dashboard() {
  const { theme, toggleTheme } = useApp();
  const { user: cu } = useUser();
  const { signOut } = useClerk();
  const api = useApi();
  const user = {
    name: cu?.fullName || cu?.firstName || "User",
    phone: (cu?.primaryPhoneNumber?.phoneNumber || "").replace(/^\+91/, ""),
  };
  const dark = theme === "dark";

  const [tab, setTab] = useState("home");
  const [aiOpen, setAiOpen] = useState(false);
  const [aiClosing, setAiClosing] = useState(false);
  const [sideOpen, setSideOpen] = useState(false);
  const [sosActive, setSosActive] = useState(false);
  const [sosCountdown, setSosCountdown] = useState(3);
  const [userLocation, setUserLocation] = useState(null);
  const [contacts, setContacts] = useState([]);
  const sos = useRef({ timer: null, watch: null, id: null, last: 0 });

  useEffect(() => {
    api.get("/api/contacts").then(r => setContacts(r.data.map(c => ({ ...c, relation: c.relationship })))).catch(() => {});
    return () => {
      clearInterval(sos.current.timer);
      if (sos.current.watch != null) navigator.geolocation.clearWatch(sos.current.watch);
    };
  }, [api]);

  const closeAI = () => {
    setAiClosing(true);
    setTimeout(() => { setAiOpen(false); setAiClosing(false); }, 240);
  };
  const goTab = (id) => { setTab(id); setSideOpen(false); };
  const handleLogout = () => signOut({ redirectUrl: "/sign-in" });
  const handleDelete = async () => {
    if (!window.confirm("Delete your account? This cannot be undone.")) return;
    try { await cu.delete(); } catch { toast.error("Delete failed"); }
  };

  // Countdown pehle chalta hai; server call + emails countdown KHATAM hone ke baad hi jaate hain,
  // isliye Cancel dabane par kuch nahi jaata.
  const handleSOS = () => {
    if (sosActive) return;
    if (!contacts.length) return toast.warn("Add an emergency contact first");
    setSosActive(true);
    setSosCountdown(3);
    let c = 3;
    sos.current.timer = setInterval(() => {
      c--;
      setSosCountdown(c);
      if (c <= 0) { clearInterval(sos.current.timer); triggerSOS(); }
    }, 1000);
  };

  const triggerSOS = async () => {
    try {
      const { coords } = await getPos();
      const { latitude: lat, longitude: lng } = coords;
      const mapLink = `https://maps.google.com/?q=${lat},${lng}`;
      setUserLocation(mapLink);
      const { data } = await api.post("/api/sos", { lat, lng });
      sos.current.id = data.id;
      const sent = await sendSosEmails(data, mapLink);
      sent ? toast.success(`SOS email sent to ${sent} contact(s)`) : toast.warn("Add an email to a contact to notify them");
      sos.current.watch = navigator.geolocation.watchPosition(
        (p) => {
          if (Date.now() - sos.current.last < 10000) return;
          sos.current.last = Date.now();
          api.post(`/api/sos/${data.id}/location`, { lat: p.coords.latitude, lng: p.coords.longitude }).catch(() => {});
        },
        null,
        { enableHighAccuracy: true }
      );
    } catch (e) {
      toast.error(e.response?.data?.error || "Could not send SOS. Please enable location and retry.");
      cancelSOS();
    }
  };

  const cancelSOS = () => {
    clearInterval(sos.current.timer);
    if (sos.current.watch != null) navigator.geolocation.clearWatch(sos.current.watch);
    if (sos.current.id) api.post(`/api/sos/${sos.current.id}/end`).catch(() => {});
    sos.current = { timer: null, watch: null, id: null, last: 0 };
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
