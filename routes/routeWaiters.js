const express = require('express');
const router = express.Router();
const Waiter = require('../models/waiters');
const waitersData = require('../data/waitersData');

// Read all waiters from database
router.get('/', async (req, res) => {
  try {
    const data = await Waiter.find();
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).send('error');
  }
});

// Create waiters from data
router.post('/', async (req, res) => {
  try {
    await Waiter.insertMany(waitersData);
    if (req.io) req.io.emit('waiters_updated');
    res.send('add successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('error');
  }
});

// Update a waiter's status or details
router.put('/:id', async (req, res) => {
  try {
    const updated = await Waiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (req.io) req.io.emit('waiters_updated', updated);
    res.json(updated);
  } catch (err) {
    console.log(err);
    res.status(500).send('error');
  }
});

// Delete a waiter
router.delete('/:id', async (req, res) => {
  try {
    await Waiter.findByIdAndDelete(req.params.id);
    if (req.io) req.io.emit('waiters_updated');
    res.send('deleted successfully');
  } catch (err) {
    console.log(err);
    res.status(500).send('error');
  }
});

module.exports = router;
