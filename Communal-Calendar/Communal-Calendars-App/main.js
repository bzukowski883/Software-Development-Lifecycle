const { app, BrowserWindow } = require("electron");         //makes sure electrion is included
const path = require("path");                               //initializes path
const { initializeCalendarData } = require("./calendar");   //creates the calendar inizialization function
const axios = require("axios");                             //requires the ability to send to remote server
const { ipcMain } = require("electron");                    

function createWindow() {                           //creates the window object with below settings
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      contextIsolation: true,                       //isolates context for security
      preload: path.join(__dirname, "preload.js")   //preloads functions
    }
  });
  win.webContents.openDevTools();
  win.removeMenu();             //removes standard hotbar
  win.loadFile("index.html");   //loads index into the new window
}

app.whenReady().then(() => {    //when the app is ready does:
  initializeCalendarData();     //runs ./calendar.js
  createWindow();               //actually launches the window so you can see it
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();    //if on mac doesn't close app if all windows are closed like native applications
});











//below are the functions used to retrieve data from the server.

ipcMain.handle("login-user", async (event, { username, password }) => {
  try {
    const response = await axios.post("http://localhost:3000/users/login", {
      username,
      password
    }, {
      headers: { "Content-Type": "application/json" }
    });
    return response.data; // { accessToken, refreshToken, message }
  } catch (err) {
    console.error("Login failed:", err.message);
    throw err;
  }
});

ipcMain.handle("create-event", async (event, { username, eventData, accessToken }) => {
  try {
    const response = await axios.post(
      `http://localhost:3000/calendar/events/${username}`,
      eventData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`
        }
      }
    );
    return response.data;
  } catch (err) {
    console.error("Event creation failed:", err.message);
    throw err;
  }
});

ipcMain.handle("get-events", async (event, { username, accessToken }) => {
  try {
    const response = await axios.get(`http://localhost:3000/calendar/events/${username}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (err) {
    console.error("Failed to retrieve events:", err.message);
    throw err;
  }
});

ipcMain.handle("retrieve-categories", async (event, { username, accessToken }) => {
  try {
    const response = await axios.get(`http://localhost:3000/calendar/categories/${username}`,{ 
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });
    return response.data;
  } catch (err) {
    console.error("Failed to retrieve categories:", err.message);
    throw err;
  }
});