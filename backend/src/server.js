require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const { clerkMiddleware } = require("@clerk/express");

const app = express();
app.set("trust proxy", 1);
app.use(helmet());
app.use(cors({ origin: (process.env.CORS_ORIGINS || "").split(",").filter(Boolean) }));
app.use(express.json({ limit: "10kb" }));
app.use(rateLimit({ windowMs: 60_000, limit: 120 }));

app.get("/health", (_req, res) => res.json({ ok: true }));

// Public: contact ko login ke bina live location dikhta hai
app.use("/api/track", require("./routes/track"));

// Neeche sab kuch Clerk login maangta hai
app.use(clerkMiddleware());
app.use("/api/contacts", require("./routes/contacts"));
app.use("/api/sos", require("./routes/sos"));
app.use("/api/reports", require("./routes/reports"));

app.use((_req, res) => res.status(404).json({ error: "Not found" }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`HerShield API on :${PORT}`));
