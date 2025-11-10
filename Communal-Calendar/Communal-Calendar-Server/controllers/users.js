const fs = require("fs");           //requires file editing
const path = require("path");       //requires path functions
const bcrypt = require("bcrypt");   //requires encryption

const { loadJson, saveJson, createUserFolder } = require("../utils/fileUtils");
const { hashPassword, comparePassword } = require("../utils/cryptoUtils");
const { isValidUsername, isValidPassword } = require("../utils/validationUtils");
const { generateAccessToken, generateRefreshToken } = require("../utils/tokenUtils");



const USERS_FILE = path.join(__dirname, "..", "users", "users.json");   //goes up to main directory and back down into users

async function registerUser(username, password) {   
  const users = loadJson(USERS_FILE);   //loads all ussers
  if (!isValidUsername(username)) {
    throw new Error("Invalid username format");
  }

  if (!isValidPassword(password)) {
    throw new Error("Password must be at least 8 chars, with letters and numbers");
  }

  const passwordHash = await hashPassword(password); //hashes the password
  users[username] = { passwordHash };
  saveJson(USERS_FILE, users);  //saves the user to the file
  createUserFolder(username);   //creates a new folder
}


async function loginUser(username, password) {
  const users = loadJson(USERS_FILE);   //loads the usrs json data
  console.log("Login attempt:", username, password);
  console.log("Users on file:", users);

  // Find the user object in the array
  const user = users.find(u => u.username === username);
  if (!user) {
    throw new Error("User not found");
  }

  // Compare password (adjust field name if you stored plain text vs hash)
  const match = await comparePassword(password, user.passwordHash || user.password);
  if (!match) {
    throw new Error("Invalid password");
  }


  const accessToken = generateAccessToken({ username }, process.env.JWT_SECRET || "defaultSuperSecretKey");
  const refreshToken = generateRefreshToken({ username }, process.env.JWT_REFRESH_SECRET || "defaultSuperSecretKey");

  return {
    message: "Login successful",
    accessToken,
    refreshToken,
  };
}


module.exports = { registerUser, loginUser };