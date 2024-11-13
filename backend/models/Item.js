import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  isCut: { type: Boolean, default: false },
  sequenceNumber: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
});

// Middleware to update the `lastUpdated` field before saving the document
itemSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export default Item;
