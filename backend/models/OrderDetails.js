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
      unit: { type: String, required: true },  // Added unit field
    },
  ],
  subtotal: { type: Number },
  packagingFee: { type: Number, default: 5 },
  total: { type: Number },
  lastUpdated: { type: Date, default: Date.now },
});

// Middleware to update the `lastUpdated` field before saving the document
orderDetailsSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.models.OrderDetails || mongoose.model('OrderDetails', orderDetailsSchema);
