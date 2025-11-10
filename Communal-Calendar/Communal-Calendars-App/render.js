function formSubmit(event) {
  event.preventDefault();

  const eventName = document.getElementById("Event").value;
  const startDate = document.getElementById("Start-Date").value;
  const startTime = document.getElementById("Start-Time").value;
  const endTime = document.getElementById("End-Time").value;
  const endDate = document.getElementById("End-Date").value || startDate;
  const privacy = document.querySelector("input[name=Privacy]:checked")?.id;
  const repeat = document.getElementById("Repeat").value;
  const friends = Array.from(document.querySelectorAll("input[name=Friend]:checked")).map(f => f.id) || false;

  const NewEvent = { eventName, startDate, startTime, endTime, endDate, privacy, repeat, friends };

  createEvent(sessionStorage.getItem("username"), NewEvent);
}

//creates the filter checkboxes in the top right
function SetFilter(categories) {
  const FilterContent = document.getElementById("filterMenuStuff");
  categories.forEach(category => {
    const label = document.createElement("label");
    const check = document.createElement("input");
    check.checked = true;
    check.type = "checkbox";
    check.value = category.name;
    label.textContent = category.name;
    label.insertBefore(check, label.firstChild);
    FilterContent.appendChild(label);
    check.addEventListener("change", () => {
      const schedules = document.getElementsByClassName(category.name);
      Array.from(schedules).forEach(schedule => {
        schedule.style.display = check.checked ? "block" : "none";
      });
    });
  });
}

//applies category colors to the different events
function ApplyCategories(categories) {
  categories.forEach(category => {
    const items = document.getElementsByClassName(category.name);
    Array.from(items).forEach(item => {
      item.style.backgroundColor = category.color;
      item.innerHTML = category.name;
      if (category.privacy === "private") {
        item.style.border = "2px solid black";
      }
    });
  });
}

// Sign‑in popup logic
function setupSignInPopup() {
  const signInButton = document.querySelector(".signInButton > button");
  const signInOverlay = document.querySelector(".signInPopUpOverlay");
  const closePopup = document.querySelector(".closeSignInPopUp");
  const signInSubmit = document.querySelector("#signInSubmit");
  const userNameInput = document.querySelector("#userNameInput");
  const passwordInput = document.querySelector("#passwordInput");

  if (signInButton) {
    signInButton.addEventListener("click", () => {
      signInOverlay.style.display = "block";
    });
  }

  if (closePopup) {
    closePopup.addEventListener("click", () => {
      signInOverlay.style.display = "none";
    });
  }

  if (signInSubmit) {
    signInSubmit.addEventListener("click", () => {
      const username = userNameInput.value;
      const password = passwordInput.value;
      if (username && password) {
        signInOverlay.style.display = "none";
        userNameInput.value = "";
        passwordInput.value = "";
        loginUser(username, password);
      } else {
        alert("Please enter a username and password.");
      }
    });
  }
}

// DOMContentLoaded wrapper to initialize everything
function LoadUserData() {
  const username = window.sessionStorage.getItem("username");
  getCategories(username);
  getEvents(username);

  const form = document.getElementById("get-calendar-data");
  if (form) {
    form.addEventListener("submit", formSubmit);
  }

};


document.addEventListener("DOMContentLoaded", (event) =>{
  setupSignInPopup();
})



async function loginUser(username, password) {
  try {
    const { accessToken, refreshToken } = await window.electronAPI.loginUser(username, password);
    console.log("Login successful");
    console.log("Access Token:", accessToken);
    console.log("Refresh Token:", refreshToken);

    // Store tokens in memory or localStorage if needed
    window.sessionStorage.setItem("username", username);
    window.sessionStorage.setItem("accessToken", accessToken);
    window.sessionStorage.setItem("refreshToken", refreshToken);

    LoadUserData();
    return { accessToken, refreshToken };
  } catch (err) {
    console.error("Login failed:", err);
  }
}

async function createEvent(username, eventData) {
  try {
    const accessToken = window.sessionStorage.getItem("accessToken");
    const event = await window.electronAPI.createEvent(username, eventData, accessToken);
    console.log("Event created:", event);
    return event;
  } catch (err) {
    console.error("Event creation failed:", err);
  }
}

async function getEvents(username) {
  try {
    const accessToken = window.sessionStorage.getItem("accessToken");
    const events = await window.electronAPI.getEvents(username, accessToken);
    console.log("Events:", events);
    return events;
  } catch (err) {
    console.error("Failed to retrieve events:", err);
  }
}

async function getCategories(username) {
  try {
    const accessToken = window.sessionStorage.getItem("accessToken");
    const categories = await window.electronAPI.getCategories(username, accessToken);
    console.log("Categories:", categories);
    return categories;
  } catch (err) {
    console.error("Failed to retrieve categories:", err);
  }
}