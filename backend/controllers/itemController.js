import Item from "../models/Item.js";

export const getItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });
    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { order, unit } = req.body;
  try {
    const item = await Item.findById(id);
    if (!item) return res.status(404).json({ message: "Item not found" });

    if (order !== undefined) {
      const itemsToUpdate = await Item.find({ order: { $gte: order } }).sort({ order: 1 });
      itemsToUpdate.forEach((it, idx) => {
        it.order = order + idx + 1;
        it.save();
      });
      item.order = order;
    }

    if (unit) item.unit = unit;  // Update unit if provided
    Object.assign(item, req.body);
    await item.save();

    res.status(200).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByIdAndDelete(id);
    if (item) {
      // Update sequence numbers of remaining items
      await Item.updateMany(
        { sequenceNumber: { $gt: item.sequenceNumber } },
        { $inc: { sequenceNumber: -1 } }
      );
    }
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const createItem = async (req, res) => {
  try {
    const { order, unit } = req.body;

    if (order !== undefined) {
      await Item.updateMany(
        { order: { $gte: order } },
        { $inc: { order: 1 } }
      );
    }

    const item = new Item({ ...req.body, order: order || 1 });
    await item.save();

    res.status(201).json(item);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllItems = async (req, res) => {
  try {
    const items = await Item.find({}).sort({ sequenceNumber: 1 });
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
