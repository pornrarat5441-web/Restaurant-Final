const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },

  table: { type: Number, required: true },

  time: { 
    type: String, 
    default: () => {
      const now = new Date();
  
      return now.toLocaleTimeString('th-TH', {
        timeZone: 'Asia/Bangkok',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
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