import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  table: { type: Number, required: true },
  time: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['prepare', 'preparing', 'done'], 
    default: 'prepare' 
  },
  menus: [{
    name: String,
    qty: Number
  }],
  waiterName: { type: String, default: '' },
  servingStatus: { 
    type: String, 
    enum: ['complete', 'inprocess', 'failed'],
    required: false
  },
  servingTime: { type: String },
  deviceId: { type: String }
}, { timestamps: true });

export const Order = mongoose.model('Order', orderSchema);