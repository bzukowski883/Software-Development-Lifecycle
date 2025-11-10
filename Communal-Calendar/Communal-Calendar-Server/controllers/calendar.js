// controllers/calendar.js
const fs = require("fs");
const path = require("path");

// Build a path to a user's events file
function getEventsFilePath(username) {
  return path.join(__dirname, "..", "users", username, "events.json");
}

// Load events for a given user
function loadEvents(username) {
  console.error(username);  

  const filePath = getEventsFilePath(username);
  
  console.error(filePath);

  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  console.error(filePath);
  if (!fs.existsSync(filePath)) {
    // If file doesn't exist, initialize with empty array
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
    return [];
  }

  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Build a path to a user's events file
function getCategoriesFilePath(username) {
  return path.join(__dirname, "..", "users", username, "categories.json");
}

// Load events for a given user
function loadCategories(username) {
console.log(1);
  const filePath = getCategoriesFilePath(username);
  
  console.error(filePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });

  console.error(filePath);
  if (!fs.existsSync(filePath)) {
    // If file doesn't exist, initialize with empty array
    fs.writeFileSync(filePath, JSON.stringify([], null, 2), "utf8");
    return [];
  }

  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
}

// Save events for a given user
function saveEvents(username, events) {
  const filePath = getEventsFilePath(username);
  fs.writeFileSync(filePath, JSON.stringify(events, null, 2), "utf8");
}

// Append a new event for a given user
function addEvent(username, newEvent) {
  const events = loadEvents(username);
  events.push(newEvent);
  saveEvents(username, events);
  return newEvent;
}

module.exports = {
  loadEvents,
  saveEvents,
  addEvent,
  loadCategories
};