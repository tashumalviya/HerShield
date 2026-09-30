const router = require("express").Router();
const rateLimit = require("express-rate-limit");
const db = require("../db");

router.use(rateLimit({ windowMs: 60_000, limit: 60 }));

// Public. Token 128-bit random hai, guess nahi hota; 24 ghante baad link expire.
router.get("/:token", async (req, res) => {
  if (!/^[a-f0-9]{32}$/.test(req.params.token)) return res.status(404).json({ error: "Not found" });
  const [rows] = await db.query(
    `SELECT user_name AS name, lat, lng, status, updated_at
     FROM sos_events WHERE token=? AND created_at > NOW() - INTERVAL 24 HOUR`,
    [req.params.token]
  );
  if (!rows.length) return res.status(404).json({ error: "Link expired or invalid" });
  res.json(rows[0]);
});

module.exports = router;
