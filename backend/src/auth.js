const { getAuth } = require("@clerk/express");

// Clerk ka verified userId hi source of truth hai; body/params ka user_id kabhi trust nahi karte.
module.exports = (req, res, next) => {
  const { userId } = getAuth(req);
  if (!userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = userId;
  next();
};
