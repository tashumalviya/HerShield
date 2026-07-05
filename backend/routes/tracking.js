const express = require("express");
const router = express.Router();
const db = require("../db");

// Start Tracking
router.post("/start", (req, res) => {

    const { user_id, latitude, longitude } = req.body;

    const sql = `
        INSERT INTO live_tracking
        (user_id, latitude, longitude, is_tracking)
        VALUES (?, ?, ?, true)
        ON DUPLICATE KEY UPDATE
        latitude = VALUES(latitude),
        longitude = VALUES(longitude),
        is_tracking = true
    `;

    db.query(sql, [user_id, latitude, longitude], (err) => {

        if (err) return res.status(500).json(err);

        res.json({
            success: true,
            message: "Tracking Started"
        });

    });

});

// Update Location
router.post("/update", (req, res) => {

    const { user_id, latitude, longitude } = req.body;

    db.query(

        `UPDATE live_tracking
SET latitude=?,
    longitude=?,
    updated_at=NOW()
WHERE user_id=? AND is_tracking=true`,

        [latitude, longitude, user_id],

        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true
            });

        }

    );

});

// Get Live Location
router.get("/:userId", (req, res) => {

    db.query(

        "SELECT * FROM live_tracking WHERE user_id=? AND is_tracking=true",

        [req.params.userId],

        (err, result) => {

            if (err) return res.status(500).json(err);

            res.json(result[0]);

        }

    );

});

// Stop Tracking
router.post("/stop", (req, res) => {

    db.query(

        "UPDATE live_tracking SET is_tracking=false WHERE user_id=?",

        [req.body.user_id],

        (err) => {

            if (err) return res.status(500).json(err);

            res.json({
                success: true
            });

        }

    );

});

module.exports = router;