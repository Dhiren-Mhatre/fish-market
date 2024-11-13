// models/User.js
import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  mobile: { type: String, required: true },
  orders: [{ type: String }], // array of order numbers
});

export default mongoose.models.User || mongoose.model('User', userSchema);
