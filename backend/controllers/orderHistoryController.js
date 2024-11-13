import OrderHistory from "../models/OrderHistory.js";

export const getOrderHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const orderHistory = await OrderHistory.findById(id);
    if (!orderHistory) return res.status(404).json({ message: "Order history not found" });
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderHistory = async (req, res) => {
  const { id } = req.params;
  try {
    const orderHistory = await OrderHistory.findByIdAndUpdate(id, req.body, { new: true });
    if (!orderHistory) return res.status(404).json({ message: "Order history not found" });
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrderHistory = async (req, res) => {
  const { id } = req.params;
  try {
    await OrderHistory.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createOrderHistory = async (req, res) => {
  try {
    const orderHistory = new OrderHistory(req.body);
    await orderHistory.save();
    res.status(201).json(orderHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAllOrderHistory = async (req, res) => {
  try {
    const orderHistory = await OrderHistory.find({});
    res.status(200).json(orderHistory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
