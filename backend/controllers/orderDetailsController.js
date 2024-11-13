import OrderDetails from "../models/OrderDetails.js";

export const getOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const orderDetails = await OrderDetails.findById(id);
    if (!orderDetails) return res.status(404).json({ message: "Order details not found" });
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const orderDetails = await OrderDetails.findByIdAndUpdate(id, req.body, { new: true });
    if (!orderDetails) return res.status(404).json({ message: "Order details not found" });
    res.status(200).json(orderDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteOrderDetails = async (req, res) => {
  const { id } = req.params;
  try {
    await OrderDetails.findByIdAndDelete(id);
    res.status(204).end();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getLatestOrderNumber = async (req, res) => {
  try {
    // Fetch the latest order by sorting based on orderNumber in descending order
    const latestOrder = await OrderDetails.findOne().sort({ orderNumber: -1 });

    // If no order exists, return a default starting value like 10000
    const latestOrderNumber = latestOrder ? latestOrder.orderNumber : "10000";
    
    // Generate the new order number as a string
    const newOrderNumber = (parseInt(latestOrderNumber) + 1).toString();
    
    res.status(200).json({ latestOrderNumber: newOrderNumber });
  } catch (error) {
    console.error("Error fetching the latest order number:", error);
    res.status(500).json({ message: "Failed to fetch latest order number" });
  }
};

// Updated createOrderDetails function
export const createOrderDetails = async (req, res) => {
  try {
    // Check if the order number already exists
    const existingOrder = await OrderDetails.findOne({ orderNumber: req.body.orderNumber });
    if (existingOrder) {
      return res.status(400).json({ message: "Order number already exists. Please use a unique order number." });
    }

    // Create new order with the details from the request body
    const newOrder = await OrderDetails.create(req.body);
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
