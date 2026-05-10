const express = require('express');
const app = express();
const path = require('path');

require('dotenv').config();

const connectDB = require('./config/db');

const orderRoutes = require('./routes/routeOrder');
const waitersRoutes = require('./routes/routeWaiters');
const Waiter = require('./models/waiters');
const waitersData = require('./data/waitersData');

async function startServer() {
  await connectDB();
  
  // Seed waiters data if collection is empty
  const count = await Waiter.countDocuments();
  if (count === 0) {
    await Waiter.insertMany(waitersData);
    console.log('Waiters data seeded');
  }

  app.use(express.json());
  // static folders
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', orderRoutes);
  app.use('/waiters', waitersRoutes);
  //to the first page
  app.get('/', (req, res) => {
    res.redirect('/default');
  });

  // start server
  const PORT = process.env.PORT || 8080;

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();