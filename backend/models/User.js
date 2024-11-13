// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  mobile: { type: String, required: true },
  orders: [{ type: String }], // array of order numbers
  lastUpdated: { type: Date, default: Date.now },  // Added lastUpdated field
});

// Middleware to update the `lastUpdated` field before saving the document
userSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.models.User || mongoose.model('User', userSchema);
