const { app, BrowserWindow, ipcMain } = require('electron');
const fs = require('fs');

const EventsFilePath = "./test/events.json";
const CategoriesFilePath = "./test/categories.json";
const UsersFilePath = "";
let ExistingEvents = {};
let ExistingCategories = {};
let ExistingUsers = {};

function IntializeCalendarObjects(filepath = "", targetContainer){
    try {
    if (!fs.existsSync(filepath)) { //checks to see if file exists
      console.warn(`File ${filepath} does not exist.`);
      targetContainer.data = [];
      return;
    }

    const data = fs.readFileSync(filepath, 'utf8'); //reads from file

    if (!data.trim()) { //makes sure file isn't empty
      console.warn(`File ${filepath} is empty.`);
      targetContainer.data = [];
      return;
    }

    targetContainer.data = JSON.parse(data); //loads data from assigned path to variable
    console.log(`Loaded ${targetContainer.data.length} items from ${filepath}`);
  } catch (err) {
    console.error(`Failed to initialize from ${filepath}:`, err.message);
    targetContainer.data = []; //if error loads empty
  }
}

const createWindow = () => { //creates the actual electron window
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences:{
      nodeIntegration: true,
      contextIsolation: false
    }
  })
  win.webContents.openDevTools()    //opens inspect element if uncommented
  win.removeMenu()    //removes windows hotbar for application
  win.loadFile('index.html');    //loads html
}

app.whenReady().then(() => {
  
  IntializeCalendarObjects(EventsFilePath, ExistingEvents); //initialize objects after DOM load
  ExistingEvents = ExistingEvents.data;
  IntializeCalendarObjects(CategoriesFilePath, ExistingCategories);
  ExistingCategories = ExistingCategories.data;
  IntializeCalendarObjects(UsersFilePath, ExistingUsers);
  ExistingUsers = ExistingUsers.data;

  createWindow();   //opens the window we previously created

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();   
  })
})

// Receives data from create event button (MAKES EVENT DATA COLLLECTABLE)
ipcMain.handle('create-event', async (event, StringEvent) => {
  try {
    const NewEvent = JSON.parse(StringEvent);

    // Log the data we got from render.js
    Object.keys(NewEvent).forEach(key => {
      console.log(`${key}: ${NewEvent[key]}`);
    });

    // Push the event to the existing array
    ExistingEvents.push({
      Name: NewEvent.Name,
      "Start Date": NewEvent["Start Date"],
      "Time start": NewEvent["Time start"],
      "Time end": NewEvent["Time end"],
      "End Date": NewEvent["End Date"],
      Privacy: NewEvent.Privacy,
      "Repeat Frequency": NewEvent["Repeat Frequency"],
      Friends: NewEvent.Friends
    });

    // Save to events.json
    const ExistingEventsJSON = JSON.stringify(ExistingEvents, null, 2);
    fs.writeFile(EventsFilePath, ExistingEventsJSON, 'utf8', (err) => {
      if (err) {
        console.error(`Error writing to file: ${err.message}`);
        return;
      }
      console.log(`Event saved successfully to ${EventsFilePath}`);
    });

    return { success: true };
  } catch (error) {
    console.error("Error in create-event:", error);
    return { success: false, error: error.message };
  }
});


ipcMain.handle('retrive-categories', async => {
  let ExistingCategoriesString = JSON.stringify(ExistingCategories)
  return(ExistingCategoriesString);
})
//closes app on mac when the app is exited out of
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
})