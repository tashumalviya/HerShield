const router = require("express").Router();
const db = require("../db");
const auth = require("../auth");
router.use(auth);

const TAGS = ["safe", "unsafe", "lighting", "crowded", "police"];

router.get("/", async (_req, res) => {
  const [rows] = await db.query(
    "SELECT id,area_name,tag,rating,review,created_at FROM area_reports ORDER BY id DESC LIMIT 100"
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const area = String(req.body.area_name || "").trim().slice(0, 150);
  const rating = Number(req.body.rating);
  const review = String(req.body.review || "").trim().slice(0, 500);
  if (!area || !TAGS.includes(req.body.tag) || !(rating >= 1 && rating <= 5))
    return res.status(400).json({ error: "Invalid report" });

  const [r] = await db.query(
    "INSERT INTO area_reports (clerk_id,area_name,tag,rating,review) VALUES (?,?,?,?,?)",
    [req.userId, area, req.body.tag, Math.round(rating), review]
  );
  res.status(201).json({ id: r.insertId });
});

module.exports = router;
