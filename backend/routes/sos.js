const express = require("express");
const router = express.Router();
const db = require("../db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

router.post("/", async (req, res) => {
  const { user_id, latitude, longitude } = req.body;

  const mapLink = `https://maps.google.com/?q=${latitude},${longitude}`;

  // Logged-in user ka naam
  db.query(
    "SELECT name FROM users WHERE id = ?",
    [user_id],
    async (err, userResult) => {
      if (err) return res.status(500).json(err);

      if (userResult.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      const userName = userResult[0].name;

      // Sirf us user ke emergency contacts
      db.query(
        "SELECT * FROM emergency_contacts WHERE user_id = ?",
        [user_id],
        async (err, contacts) => {
          if (err) return res.status(500).json(err);

          try {
            for (const contact of contacts) {

              // Agar email nahi hai to skip
              if (!contact.contact_email) continue;

              await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: contact.contact_email,
                subject: "🚨 HerShield SOS Alert",

               html: `
  <h2 style="color:red;">🚨 HerShield Emergency Alert</h2>

  <p><b>${userName}</b> needs immediate help.</p>

  <p>Current Location:</p>

  <a href="${mapLink}">
    Open Current Location
  </a>

  <br><br>

  <a
    href="http://localhost:5173/track/${user_id}"
    style="
      background:#e53935;
      color:white;
      padding:12px 20px;
      text-decoration:none;
      border-radius:8px;
      display:inline-block;
      font-weight:bold;
    "
  >
    📍 Track Live Location
  </a>

  <p>Please reach the user as soon as possible.</p>
`,
              });

              console.log(`✅ Email sent to ${contact.contact_email}`);
            }

            res.json({
              success: true,
              message: "SOS Email Sent Successfully",
            });

          } catch (mailErr) {
            console.log(mailErr);

            res.status(500).json({
              success: false,
              message: "Failed to send email",
            });
          }
        }
      );
    }
  );
});

module.exports = router;