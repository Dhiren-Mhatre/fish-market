import OrderDetails from "../models/OrderDetails.js";
import Counter from '../models/Counter.js';
export const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const orderDetails = await OrderDetails.findOne({ orderNumber: id }); // Change findById to findOne
    if (!orderDetails) return res.status(404).json({ message: "Order details not found" });
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    // Process items to ensure each item has a unit field
    if (req.body.items) {
      req.body.items = req.body.items.map(item => ({
        ...item,
        unit: item.unit || "default_unit"  // Set a default if needed
      }));
    }

    const orderDetails = await OrderDetails.findByIdAndUpdate(id, req.body, { new: true });
    if (!orderDetails) return res.status(404).json({ message: "Order details not found" });
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const getNextOrderNumber = async (req, res) => {
  try {
    const counter = await Counter.findOneAndUpdate(
      { name: 'orderNumber' }, // Ensure the counter is named uniquely
      { $inc: { sequenceValue: 1 } }, // Increment the sequence value
      { new: true, upsert: true } // Create the counter if it doesn't exist
    );
    res.status(200).json({ orderNumber: counter.sequenceValue });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching next order number' });
  }
};
export const checkOrderNumber = async (req, res) => {
  const { orderNumber } = req.body;
  try {
    const existingOrder = await OrderDetails.findOne({ orderNumber });
    if (existingOrder) {
      return res.json({ exists: true });
    }
    return res.json({ exists: false });
  } catch (error) {
    console.error("Error checking order number:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// Updated createOrderDetails function
// Updated createOrderDetails function
export const createOrderDetails = async (req, res) => {
  try {
    const { items } = req.body;

    // Ensure each item has a unit field
    const processedItems = items.map(item => ({
      ...item,
      unit: item.unit || 'default_unit',  // Set a default if required
    }));

    // Create new order with the provided order number and items
    const newOrder = await OrderDetails.create({
      ...req.body,
      items: processedItems,
    });

    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(400).json({ message: error.message });
  }
};

export const getAllOrderDetails = async (req, res) => {
  try {
    const orderDetails = await OrderDetails.find({});
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
