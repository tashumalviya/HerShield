const express = require("express");
const router = express.Router();
const db = require("../db");

// GET contacts of specific user
router.get("/:userId", (req, res) => {

  const { userId } = req.params;

  db.query(
    "SELECT * FROM emergency_contacts WHERE user_id = ? ORDER BY id DESC",
    [userId],
    (err, results) => {

      if (err) {
        return res.status(500).json(err);
      }

      res.json(results);
    }
  );
});


// ADD contact
router.post("/", (req, res) => {

 const {
  user_id,
  contact_name,
  contact_phone,
  contact_email,
  relationship
} = req.body;

const sql = `
  INSERT INTO emergency_contacts
  (user_id, contact_name, contact_phone, contact_email, relationship)
  VALUES (?, ?, ?, ?, ?)
`;

 db.query(
  sql,
  [
  user_id,
  contact_name,
  contact_phone,
  contact_email,
  relationship
],
  (err, result) => {

    if (err) {

      console.log("CONTACT ERROR =>", err);

      return res.status(500).json(err);
    }

    res.json({
      success: true,
      message: "Contact Added Successfully"
    });
  }
);
});

module.exports = router;