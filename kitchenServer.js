const express = require('express');
const app = express();
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');

require('dotenv').config();

const connectDB = require('./config/db');

const orderRoutes = require('./routes/routeOrder');
const waitersRoutes = require('./routes/routeWaiters');
const Waiter = require('./models/waiters');
const waitersData = require('./data/waitersData');

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

async function startServer() {
  await connectDB();
  
  // Seed waiters data if collection is empty
  const count = await Waiter.countDocuments();
  if (count === 0) {
    await Waiter.insertMany(waitersData);
    console.log('Waiters data seeded');
  }

  app.use(express.json());
  
  // Pass io to routes via req
  app.use((req, res, next) => {
    req.io = io;
    next();
  });

  // static folders
  app.use(express.static(path.join(__dirname, 'public')));

  app.use('/', orderRoutes);
  app.use('/waiters', waitersRoutes);

  // Socket.io connection handling
  io.on('connection', (socket) => {
    console.log('A user connected:', socket.id);
    
    socket.on('disconnect', () => {
      console.log('User disconnected:', socket.id);
    });
  });

  //to the first page
  app.get('/', (req, res) => {
    res.redirect('/index.html');
  });

  // start server
  const PORT = process.env.PORT || 8080;

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
