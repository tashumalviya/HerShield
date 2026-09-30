import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { publicApi } from "../api";

// Emergency contact ka page: login nahi chahiye, har 10 sec me location refresh hoti hai
export default function TrackPage() {
  const { token } = useParams();
  const [d, setD] = useState(null);
  const [err, setErr] = useState("");
  const { isLoaded } = useLoadScript({ googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY });

  useEffect(() => {
    let on = true;
    const load = () =>
      publicApi.get(`/api/track/${token}`).then((r) => on && setD(r.data)).catch(() => on && setErr("This link has expired or is invalid."));
    load();
    const i = setInterval(load, 10000);
    return () => { on = false; clearInterval(i); };
  }, [token]);

  const box = { maxWidth: 480, margin: "0 auto", padding: 16, fontFamily: "sans-serif" };
  if (err) return <div style={box}><h2>🛡️ HerShield</h2><p>{err}</p></div>;
  if (!d || !isLoaded) return <div style={box}>Loading…</div>;

  const pos = { lat: Number(d.lat), lng: Number(d.lng) };
  return (
    <div style={box}>
      <h2 style={{ color: d.status === "active" ? "#e53935" : "#16a34a" }}>
        {d.status === "active" ? `🚨 ${d.name} needs help` : `✅ ${d.name} ended the SOS`}
      </h2>
      <GoogleMap mapContainerStyle={{ width: "100%", height: 380, borderRadius: 16 }} center={pos} zoom={16}>
        <Marker position={pos} />
      </GoogleMap>
      <p style={{ color: "#64748b", fontSize: 13 }}>Last updated: {new Date(d.updated_at).toLocaleTimeString()}</p>
      <a href="tel:112" style={{ display: "block", textAlign: "center", padding: 14, borderRadius: 12,
        background: "#e53935", color: "white", fontWeight: 700, textDecoration: "none" }}>📞 Call 112</a>
    </div>
  );
}
