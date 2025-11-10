// utils/tokenUtils.js
const jwt = require("jsonwebtoken");

// Generate an access token (short-lived)
function generateAccessToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: "12h" });
}

// Generate a refresh token (long-lived)
function generateRefreshToken(payload, secret) {
  return jwt.sign(payload, secret, { expiresIn: "30d" });
}

// Verify tokens
function verifyToken(token, secret) {
  return jwt.verify(token, secret);
}

module.exports = { generateAccessToken, generateRefreshToken, verifyToken };