import mongoose from 'mongoose';

const waiterSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  status: { 
    type: String, 
    enum: ['available', 'busy'], 
    default: 'available' 
  }
}, { timestamps: true });

export const Waiter = mongoose.model('Waiter', waiterSchema);
