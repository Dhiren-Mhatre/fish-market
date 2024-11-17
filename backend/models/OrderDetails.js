import mongoose from "mongoose";
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
      itemName: { type: String, required: true }, // Store item name directly
      quantity: { type: Number },
      price: { type: Number },
      unit: { type: String, required: true },
    },
  ],
  subtotal: { type: Number },
  packagingFee: { type: Number, default: 5 },
  total: { type: Number },
  status: {
    type: String,
    enum: ['Pending', 'Delivered'],
    default: 'Pending',
  },
  lastUpdated: { type: Date, default: Date.now },
});

// Middleware to update the lastUpdated field
orderDetailsSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.models.OrderDetails || mongoose.model('OrderDetails', orderDetailsSchema);
