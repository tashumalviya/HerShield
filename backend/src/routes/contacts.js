const router = require("express").Router();
const db = require("../db");
const auth = require("../auth");
router.use(auth);

const MAX_CONTACTS = 5;
const isEmail = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

router.get("/", async (req, res) => {
  const [rows] = await db.query(
    "SELECT id,name,phone,email,relationship FROM contacts WHERE clerk_id=? ORDER BY id DESC",
    [req.userId]
  );
  res.json(rows);
});

router.post("/", async (req, res) => {
  const name = String(req.body.name || "").trim().slice(0, 100);
  const phone = String(req.body.phone || "").trim().slice(0, 20) || null;
  const email = String(req.body.email || "").trim().slice(0, 150) || null;
  const relationship = String(req.body.relationship || "").trim().slice(0, 50) || null;

  if (!name) return res.status(400).json({ error: "Name is required" });
  if (!phone && !email) return res.status(400).json({ error: "Phone or email is required" });
  if (email && !isEmail(email)) return res.status(400).json({ error: "Invalid email" });
  if (phone && !/^[0-9+\-\s]{7,20}$/.test(phone)) return res.status(400).json({ error: "Invalid phone" });

  const [[{ n }]] = await db.query("SELECT COUNT(*) n FROM contacts WHERE clerk_id=?", [req.userId]);
  if (n >= MAX_CONTACTS) return res.status(400).json({ error: `Max ${MAX_CONTACTS} contacts allowed` });

  const [r] = await db.query(
    "INSERT INTO contacts (clerk_id,name,phone,email,relationship) VALUES (?,?,?,?,?)",
    [req.userId, name, phone, email, relationship]
  );
  res.status(201).json({ id: r.insertId, name, phone, email, relationship });
});

router.delete("/:id", async (req, res) => {
  const [r] = await db.query("DELETE FROM contacts WHERE id=? AND clerk_id=?", [req.params.id, req.userId]);
  if (!r.affectedRows) return res.status(404).json({ error: "Contact not found" });
  res.json({ success: true });
});

module.exports = router;
