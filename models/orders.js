const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },

  table: { type: Number, required: true },

  time: { 
    type: String, 
    default: () => {
      const now = new Date();
      return `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
  },

  status: {
    type: String,
    enum: ['prepare', 'preparing', 'done'],
    default: 'prepare'
  },

  menus: [{
    name: String,
    qty: Number
  }],

  waiterName: {
    type: String,
    default: ''
  },

  servingStatus: {
    type: String,
    enum: ['complete', 'inprocess', 'failed'],
    default: null
  },

  servingTime: {
    type: String,
    default: null
  },

  deviceId: {
    type: String,
    default: null
  },

  failReason: {
    type: String,
    default: null
  }

});

module.exports = mongoose.model('Order', orderSchema);