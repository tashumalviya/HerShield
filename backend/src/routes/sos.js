const router = require("express").Router();
const crypto = require("crypto");
const { clerkClient } = require("@clerk/express");
const db = require("../db");
const auth = require("../auth");
router.use(auth);

const coord = (v, min, max) => {
  const n = Number(v);
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};

// SOS start. Frontend countdown khatam hone ke BAAD hi ise call karega,
// isliye countdown me cancel karne par kuch bhi nahi jaata.
router.post("/", async (req, res) => {
  const lat = coord(req.body.lat, -90, 90);
  const lng = coord(req.body.lng, -180, 180);
  if (lat === null || lng === null) return res.status(400).json({ error: "Valid lat/lng required" });

  const [contacts] = await db.query("SELECT name,phone,email FROM contacts WHERE clerk_id=?", [req.userId]);
  if (!contacts.length) return res.status(400).json({ error: "Add at least one emergency contact first" });

  const user = await clerkClient.users.getUser(req.userId);
  const userName = (user.firstName || "Someone").slice(0, 100);
  const token = crypto.randomBytes(16).toString("hex");

  const [r] = await db.query(
    "INSERT INTO sos_events (clerk_id,user_name,token,lat,lng) VALUES (?,?,?,?,?)",
    [req.userId, userName, token, lat, lng]
  );
  // Frontend is response se EmailJS ke through contacts ko email bhejega
  res.status(201).json({
    id: r.insertId,
    userName,
    trackUrl: `${process.env.FRONTEND_URL}/track/${token}`,
    contacts,
  });
});

router.post("/:id/location", async (req, res) => {
  const lat = coord(req.body.lat, -90, 90);
  const lng = coord(req.body.lng, -180, 180);
  if (lat === null || lng === null) return res.status(400).json({ error: "Valid lat/lng required" });
  const [r] = await db.query(
    "UPDATE sos_events SET lat=?, lng=? WHERE id=? AND clerk_id=? AND status='active'",
    [lat, lng, req.params.id, req.userId]
  );
  if (!r.affectedRows) return res.status(404).json({ error: "No active SOS" });
  res.json({ success: true });
});

router.post("/:id/end", async (req, res) => {
  const [r] = await db.query(
    "UPDATE sos_events SET status='ended', ended_at=NOW() WHERE id=? AND clerk_id=? AND status='active'",
    [req.params.id, req.userId]
  );
  if (!r.affectedRows) return res.status(404).json({ error: "No active SOS" });
  res.json({ success: true });
});

// Recent Alerts list
router.get("/", async (req, res) => {
  const [rows] = await db.query(
    "SELECT id,status,lat,lng,created_at,ended_at FROM sos_events WHERE clerk_id=? ORDER BY id DESC LIMIT 20",
    [req.userId]
  );
  res.json(rows);
});

module.exports = router;
