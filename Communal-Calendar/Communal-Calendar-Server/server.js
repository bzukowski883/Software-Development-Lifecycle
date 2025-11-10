// server.js
const express = require("express");
const calendarRouter = require("./routes/calendar");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");

const app = express();

// EDIT: use built-in body parsing
app.use(express.json());

// EDIT: mount auth routes for refresh token flow
app.use("/auth", authRouter);
app.use("/calendar", calendarRouter);
app.use("/users", usersRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});