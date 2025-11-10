// utils/fileUtils.js
const fs = require("fs");
const path = require("path");

// Load JSON safely
function loadJson(filePath) {
  if (!fs.existsSync(filePath)) return {};
  try {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error loading JSON from ${filePath}:`, err);
    return {};
  }
}

// Save JSON safely
function saveJson(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error(`Error saving JSON to ${filePath}:`, err);
  }
}

// Create a new user folder with starter files
function createUserFolder(username) {
  const userDir = path.join(__dirname, "..", "users", username);
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir);
    const starterFiles = ["events.json", "categories.json", "friends.json", "friendRequests.json"];
    starterFiles.forEach(file =>
      fs.writeFileSync(path.join(userDir, file), "[]", "utf8")
    );
  }
}

module.exports = { loadJson, saveJson, createUserFolder };