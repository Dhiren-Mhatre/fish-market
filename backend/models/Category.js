import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  order: { type: Number, default: 0 },  // Renamed from `sequenceNumber` to `order` for consistency
  items: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Item',
    }
  ],
  lastUpdated: { type: Date, default: Date.now }
});

// Middleware to update the `lastUpdated` field before saving the document
categorySchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

export default mongoose.models.Category || mongoose.model('Category', categorySchema);
