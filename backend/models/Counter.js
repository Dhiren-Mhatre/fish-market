// /models/Counter.js
import mongoose from 'mongoose';

const counterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  sequenceValue: { type: Number, default: 10000 }
});

export default mongoose.models.Counter || mongoose.model('Counter', counterSchema);
