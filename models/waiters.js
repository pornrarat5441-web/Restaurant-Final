const mongoose = require('mongoose');

const waiterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['available', 'busy'], 
    default: 'available' 
  },
  deviceId: { type: String }
}, { timestamps: true });

// export const Waiter = mongoose.model('Waiter', waiterSchema);

module.exports = mongoose.model('Waiter', waiterSchema);
