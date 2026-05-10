const express = require('express');
const router = express.Router();
const Waiter = require('../models/waiters');
const waiters = require('../data/waitersData');

router.get('/', (req, res) => {
  res.json(waiters);
});

//create
router.post('/waiters', async (req,res) => {
  try {

    const newWaiter = new Waiter(req.body);

    await newWaiter.save();

    res.send('add successfully');

  } catch(err) {

    console.log(err);

    res.send('error');

  }
});

//read
router.get('/waiters', async (req,res) => {
  try {
    const data = await Waiter.find();
    res.send(data);
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

//update
router.put('/:id', async (req,res) => {
  try {

    const updated = await Waiter.findByIdAndUpdate(
      req.params.id,
      req.body,
      { returnDocument: 'after' }
    );

    res.json(updated);

  } catch(err) {
    console.log(err);
    res.send('error');
  }
});

//delete
router.delete('/waiters/:id', async (req,res) => {
  try {
    await Waiter.findByIdAndDelete(req.params.id);
    res.send('deleted successfully');
  } catch(err) {
    console.log(err);
    res.send('error');
  }
});


module.exports = router;
