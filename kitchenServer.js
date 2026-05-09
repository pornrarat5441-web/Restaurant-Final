const express = require('express');
const app = express();
const path = require('path');
const Order = require('./models/orders');
const orders = require('./data/ordersData');

require('dotenv').config();

const connectDB = require('./config/db');

connectDB();

app.use(express.json());
// static folders
app.use(express.static(path.join(__dirname, 'public')));

//to the first page
app.use('/', (req, res) => {
  res.redirect('/default');
});

app.get('/orders', async(req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

app.get('/seed', async (req, res) => {

  console.log('seed route working');

  try {

    await Order.deleteMany();

    const result = await Order.insertMany(orders);

    console.log(result);

    res.json(result);

  } catch(err) {

    console.log(err);

    res.status(500).json({
      message: err.message
    });

  }

});

// app.post('/orders', async (req, res) => {

//   try {

//     const newOrder = await Order.create(req.body);

//     res.status(201).json(newOrder);

//   } catch(err) {

//     res.status(500).json({
//       message: err.message
//     });

//   }

// });

app.post('/orders', async (req, res) => {
const newOrder = await Order.create({
    id: req.body.id,
    table: req.body.table,
    time: req.body.time,
    status: req.body.status,
    menus: req.body.menus,
    waiterName: req.body.waiterName,
    servingStatus: req.body.servingStatus,
    servingTime: req.body.servingTime,
    deviceId: req.body.deviceId
  })
  res.json(newOrder);
});



//order testing
async function testOrder() {

    try {
        const newOrder = await Order.insertMany(orders);
        console.log(newOrder);
    } catch(err) {
        console.log(err);
    }
}
testOrder();


// app.use("/", express.static(path.join(__dirname, "defaultPages")));

// app.use(
//   "/kitchenDashboard",
//   express.static(path.join(__dirname, "kitchen_frontend"))
// );

// start server
const PORT = process.env.PORT || 8080;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});