import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  sequenceNumber: { type: Number, required: true },
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    }
  ]
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
