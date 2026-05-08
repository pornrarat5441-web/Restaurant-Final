const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();

const connectDB = require('./config/db');

connectDB();

app.use(express.json());

// static folders
app.use("/", express.static(path.join(__dirname, "defaultPages")));

app.use(
  "/kitchenDashboard",
  express.static(path.join(__dirname, "kitchen_frontend"))
);

// start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});