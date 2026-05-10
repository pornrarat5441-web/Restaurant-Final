const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();

const connectDB = require('./config/db');

const orderRoutes = require('./routes/routeOrder');

connectDB();

app.use(express.json());
// static folders
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', orderRoutes);
//to the first page
app.get('/', (req, res) => {
  res.redirect('/default');
});

// start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});