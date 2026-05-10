const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const orders = require('../data/ordersData');

//post
router.post('/orders', async (req,res) => {
  try {
    await Order.insertMany(orders);
    res.send('add successfully');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

module.exports = router;
