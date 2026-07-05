require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = require("./db");
const authRoutes = require("./routes/auth");
const contactRoutes = require("./routes/contacts");
const feedbackRoutes = require("./routes/feedback");
const sosRoute = require("./routes/sos");
const trackingRoute = require("./routes/tracking");


app.use("/api/auth", authRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/sos", sosRoute);
app.use("/api/tracking", trackingRoute);

app.get("/", (req, res) => {
  res.json({
    message: "HerShield Backend Running"
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});