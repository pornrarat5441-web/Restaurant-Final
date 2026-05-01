const express = require('express');
const app = express();
const path = require('path');

// const kitchenRouter = require('./routing'); // 👈 import router

app.use("/", express.static(path.join(__dirname, "defaultPages")));

app.use("/kitchenDashboard", express.static(path.join(__dirname, "kitchen_frontend")));

// app.use("/", kitchenRouter);

app.listen(8080, () => {
  console.log('run server at port 8080');
});