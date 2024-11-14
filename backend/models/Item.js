import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  isCut: { type: Boolean, default: false },
  order: { type: Number, required: true },
  lastUpdated: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
  unit: { type: String, required: true }  // New field for unit
});

itemSchema.pre('save', function (next) {
  this.lastUpdated = Date.now();
  next();
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export default Item;
