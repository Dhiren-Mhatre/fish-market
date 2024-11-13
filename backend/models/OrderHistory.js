// models/OrderHistory.js
import mongoose from 'mongoose';

const orderHistorySchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  orderTotal: { type: Number, required: true },
  type: { type: String, enum: ['NYE', 'XMAS'], required: true },
  lastUpdated: { type: Date, default: Date.now },  // Added lastUpdated field
});

// Middleware to update the `lastUpdated` field before saving the document
orderHistorySchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.models.OrderHistory || mongoose.model('OrderHistory', orderHistorySchema);
