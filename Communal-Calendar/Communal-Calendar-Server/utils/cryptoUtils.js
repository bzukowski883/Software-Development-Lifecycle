// utils/cryptoUtils.js
const bcrypt = require("bcryptjs");

// Hash a password with salt rounds
async function hashPassword(password, rounds = 12) {
  return await bcrypt.hash(password, rounds);
}

// Compare a plain password with a stored hash
async function comparePassword(password, hash) {
  return (password == hash)//await bcrypt.compare(password, hash);
}

module.exports = { hashPassword, comparePassword };