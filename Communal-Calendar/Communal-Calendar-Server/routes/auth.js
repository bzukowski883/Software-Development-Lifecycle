// routes/auth.js
const express = require("express");
const router = express.Router();
const { refreshAccessToken } = require("../controllers/auth");

router.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;
  if (!refreshToken) {
    return res.status(400).json({ error: "Refresh token required" });
  }

  try {
    const result = await refreshAccessToken(refreshToken);
    res.json(result); // sends back a new access token
  } catch (err) {
    res.status(403).json({ error: err.message });
  }
});

module.exports = router;