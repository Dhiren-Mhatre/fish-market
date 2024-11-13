// models/OrderDetails.js
import mongoose from 'mongoose';

const orderDetailsSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, unique: true },
  customerName: { type: String, required: true },
  phone: { type: String, required: true },
  mobile: { type: String, required: true },
  type: { type: String, enum: ['NYE', 'XMAS'], required: true },
  orderDate: { type: Date, default: Date.now },
  specialRequest: { type: String },
  items: [
    {
      item: { type: mongoose.Schema.Types.ObjectId, ref: 'Item' },
      quantity: { type: Number },
      price: { type: Number },
    },
  ],
  subtotal: { type: Number },
  deposit: { type: Number, default: 50 },
  packagingFee: { type: Number, default: 5 },
  total: { type: Number },
});

export default mongoose.models.OrderDetails || mongoose.model('OrderDetails', orderDetailsSchema);
