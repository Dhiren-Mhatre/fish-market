import axios from "axios";

const API_BASE_URL = "https://fish-martket-backend.onrender.com"; // Update as needed

export const fetchOrderDetails = async (orderNumber) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/order-details/${orderNumber}`
    );
    return response.data;
  } catch (error) {
    throw new Error("Order not found");
  }
};

export const fetchAllOrders = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/order-details`);
    return response.data;
  } catch (error) {
    throw new Error("Error fetching orders");
  }
};
