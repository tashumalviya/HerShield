const express = require("express");
const bcrypt = require("bcryptjs");
const db = require("../db");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const router = express.Router();

router.get("/test", (req, res) => {
  res.json({
    message: "Auth Route Working"
  });
});

// CHECK USER BY EMAIL
router.post("/check-user", (req, res) => {

  const { email } = req.body;

  db.query(
    "SELECT * FROM users WHERE email = ?",
    [email],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server Error"
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        user: {
          id: result[0].id,
          name: result[0].name,
          email: result[0].email,
          phone: result[0].phone,
          onboarding_done: result[0].onboarding_done
        }
      });

    }
  );

});

router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const sql =
"INSERT INTO users (name,email,phone,password_hash) VALUES (?,?,?,?)";

    db.query(
      sql,
      [name, email, phone, hashedPassword],
      (err, result) => {
     if (err) {
  console.log("MYSQL ERROR:", err);

  return res.status(500).json({
    message: err.sqlMessage || "Registration failed"
  });
}

        res.status(201).json({
  message: "User registered successfully",
  user: {
    id: result.insertId,
    name,
    email,
    phone
  }
});
      }
    );
  } catch (error) {
    res.status(500).json({
      message: "Server Error"
    });
  }
});

// STORE OTP TEMPORARILY
const otpStore = {};

// SEND EMAIL OTP
// SEND EMAIL OTP
router.post("/send-otp", async (req, res) => {

  try {

    const { email } = req.body;

    // Pehle check karo user exist karta hai ya nahi
    db.query(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, result) => {

        if (err) {
          return res.status(500).json({
            success: false,
            message: "Server Error"
          });
        }

        if (result.length === 0) {
          return res.status(404).json({
            success: false,
            message: "User not found"
          });
        }

        // OTP Generate
        const otp = Math.floor(100000 + Math.random() * 900000);

        otpStore[email] = otp;

        await transporter.sendMail({
          from: process.env.EMAIL_USER,
          to: email,
          subject: "HerShield OTP Verification",
          html: `
            <h2>HerShield Verification</h2>
            <p>Your OTP is:</p>
            <h1>${otp}</h1>
            <p>Valid for 5 minutes.</p>
          `,
        });

        res.json({
          success: true,
          message: "OTP sent successfully"
        });

      }
    );

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });

  }

});

// verify otp
router.post("/verify-otp", (req, res) => {
  const { email, otp } = req.body;

  if (otpStore[email] == otp) {
    delete otpStore[email];

    return res.json({
      success: true,
      message: "OTP verified",
    });
  }

  res.status(400).json({
    success: false,
    message: "Invalid OTP",
  });
});

router.post("/login", (req, res) => {

  const { email, password } = req.body;

  const sql = "SELECT * FROM users WHERE email = ?";

  db.query(sql, [email], async (err, result) => {

    if (err) {
      return res.status(500).json({
        message: "Server Error"
      });
    }

    if (result.length === 0) {
      return res.status(400).json({
        message: "User not found"
      });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(
      password,
      user.password_hash
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    res.json({
      success: true,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });

  });

});

// UPDATE ONBOARDING STATUS
router.post("/complete-onboarding", (req, res) => {

  const { userId } = req.body;

  db.query(
    "UPDATE users SET onboarding_done = 1 WHERE id = ?",
    [userId],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: "Server Error"
        });
      }

      res.json({
        success: true,
        message: "Onboarding completed"
      });

    }
  );

});

router.delete("/delete/:id", (req, res) => {

  const id = req.params.id;

  db.query(
    "DELETE FROM users WHERE id = ?",
    [id],
    (err, result) => {

      if (err) {
        return res.status(500).json({
          success: false,
          message: err.message
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      res.json({
        success: true,
        message: "Account deleted successfully"
      });

    }
  );

});

module.exports = router;

