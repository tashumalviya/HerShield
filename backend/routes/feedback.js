const express = require("express");
const router = express.Router();
const db = require("../db");

// GET all feedbacks
router.get("/", (req, res) => {
  const sql = "SELECT * FROM feedback ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("MYSQL ERROR:", err);
      return res.status(500).json(err);
    }

    res.json(results);
  });
});

// ADD feedback
router.post("/", (req, res) => {

  console.log("Feedback Data Received:", req.body);

  const {
    user_id,
    area_name,
    tag,
    rating,
    review
  } = req.body;

  const sql = `
    INSERT INTO feedback
    (user_id, area_name, tag, rating, review)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [user_id, area_name, tag, rating, review],
    (err, result) => {

      if (err) {
        console.log("MYSQL ERROR:", err);

        return res.status(500).json({
          success: false,
          error: err.sqlMessage
        });
      }

      res.json({
        success: true,
        message: "Feedback Added Successfully",
        id: result.insertId
      });
    }
  );
});

module.exports = router;