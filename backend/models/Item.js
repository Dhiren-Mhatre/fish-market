import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  isCut: { type: Boolean, default: false },
  sequenceNumber: { type: Number, required: true },
});

const Item = mongoose.models.Item || mongoose.model("Item", itemSchema);
export default Item;
