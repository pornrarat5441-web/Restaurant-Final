const express = require('express');
const router = express.Router();
const Order = require('../models/orders');
const orders = require('../data/ordersData');

//create
router.post('/orders', async (req,res) => {
  try {
    const orderData = req.body;

    if (!orderData || Object.keys(orderData).length === 0) {
      return res.status(400).json({ error: "Order data is required" });
    }

    const newOrder = new Order(orderData);
    await newOrder.save();
    
    if (req.io) {
      req.io.emit('orders_updated');
      console.log('DEBUG: Emitted orders_updated event for new order');
    }
    res.status(201).json({ message: 'Order added successfully', order: newOrder });
  } catch(err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
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
router.put('/orders/:id', async (req, res) => {
  try {

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    if (req.io) req.io.emit('orders_updated', updatedOrder);
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
    if (req.io) req.io.emit('orders_updated');
    res.send('deleted successfully');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});
module.exports = router;
