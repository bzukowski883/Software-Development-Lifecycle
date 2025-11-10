// controllers/auth.js
const { generateAccessToken, verifyToken } = require("../utils/tokenUtils");

async function refreshAccessToken(refreshToken) {
  try {
    // Verify the refresh token with the refresh secret
    const payload = verifyToken(refreshToken, process.env.JWT_REFRESH_SECRET || "defaultSuperSecretKey");

    // Issue a new access token using the same payload
    const newAccessToken = generateAccessToken(
      { username: payload.username },
      process.env.JWT_SECRET || "defaultSuperSecretKey"

    );

    return { accessToken: newAccessToken };
  } catch (err) {
    throw new Error("Invalid or expired refresh token");
  }
}

module.exports = { refreshAccessToken };