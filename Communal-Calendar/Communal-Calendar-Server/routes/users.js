// routes/users.js
const express = require("express");
const router = express.Router();

const { registerUser, loginUser } = require("../controllers/users");

router.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    await registerUser(username, password);
    res.json({ success: true, message: "User registered" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await loginUser(username, password);
    res.json(result); // sends back both tokens
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;