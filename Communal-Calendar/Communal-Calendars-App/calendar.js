const fs = require("fs");
const path = require("path");

const EventsFilePath = path.join(__dirname, "test", "events.json");
const CategoriesFilePath = path.join(__dirname, "test", "categories.json");
const UsersFilePath = path.join(__dirname, "test", "users.json");

const ExistingEvents = { data: [] };
const ExistingCategories = { data: [] };
const ExistingUsers = { data: [] };

function loadJSON(filepath) {
  try {
    if (!fs.existsSync(filepath)) return [];
    const data = fs.readFileSync(filepath, "utf8");
    return data.trim() ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function initializeCalendarData() {
  ExistingEvents.data = loadJSON(EventsFilePath);
  ExistingCategories.data = loadJSON(CategoriesFilePath);
  ExistingUsers.data = loadJSON(UsersFilePath);
}

function saveEvents(events) {
  fs.writeFileSync(EventsFilePath, JSON.stringify(events, null, 2), "utf8");
}

module.exports = {  //allows this file to be imported at the start of main
  EventsFilePath,
  ExistingEvents,
  ExistingCategories,
  ExistingUsers,
  initializeCalendarData,
  saveEvents
};