const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const orders = require('../data/ordersData');

//create
router.post('/orders', async (req,res) => {
  try {
    await Order.insertMany(orders);
    res.send('add successfully');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

//read
router.get('/orders', async (req,res) => {
  try {
    const data = await Order.find();
    res.send(data);
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

//update
router.put('/orders/:id', async (req,res) => {
  try {
    await Order.findByIdAndUpdate(req.params.id, req.body);
    res.send('update successfully');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

//delete
router.delete('/orders/:id', async (req,res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.send('deleted successfully');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});
module.exports = router;
