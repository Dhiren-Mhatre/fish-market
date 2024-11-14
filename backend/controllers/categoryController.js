import Category from "../models/Category.js";

// Retrieve a single category by ID with items populated
export const getCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id).populate("items");
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a category by ID and maintain sequence
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { order } = req.body;

  try {
    const existingCategory = await Category.findById(id);
    if (!existingCategory) return res.status(404).json({ message: "Category not found" });

    // If order is updated, shift the sequence of other categories
    if (order !== undefined && order !== existingCategory.order) {
      await adjustOrder(existingCategory.order, order);
    }

    const category = await Category.findByIdAndUpdate(id, req.body, { new: true });
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a category by ID and update sequencing
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const categoryToDelete = await Category.findById(id);
    if (!categoryToDelete) return res.status(404).json({ message: "Category not found" });

    // Remove category and adjust sequence
    await Category.findByIdAndDelete(id);
    await adjustOrder(categoryToDelete.order, null, true); // Shift all categories after the deleted one up
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create a new category and add it to the end of the sequence
export const createCategory = async (req, res) => {
  try {
    const highestOrderCategory = await Category.findOne().sort("-order").exec();
    const newOrder = highestOrderCategory ? highestOrderCategory.order + 1 : 0;

    const category = new Category({ ...req.body, order: newOrder });
    await category.save();
    res.status(201).json(category);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Retrieve all categories in sequence
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({}).sort("order").populate("items");
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Helper function to adjust the order field for sequencing
async function adjustOrder(from, to, isDeletion = false) {
  if (isDeletion) {
    // Move all categories after the deleted one up
    await Category.updateMany({ order: { $gt: from } }, { $inc: { order: -1 } });
  } else if (from < to) {
    // Move categories between old and new positions down
    await Category.updateMany({ order: { $gt: from, $lte: to } }, { $inc: { order: -1 } });
  } else if (from > to) {
    // Move categories between new and old positions up
    await Category.updateMany({ order: { $gte: to, $lt: from } }, { $inc: { order: 1 } });
  }
}
