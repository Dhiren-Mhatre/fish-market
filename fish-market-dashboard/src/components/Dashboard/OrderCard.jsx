import React, { useState } from 'react';
import axios from 'axios';

const OrderCard = ({ order, refreshOrders }) => {
  const [status, setStatus] = useState(order.status || 'Pending');
  const statusOptions = ['Pending', 'Delivered'];

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);
  
    try {
      const backendUrl = "http://localhost:5000"; // Replace with env variable if configured
      await axios.put(`${backendUrl}/api/order-details/${order._id}`, { status: newStatus });
      if (refreshOrders) refreshOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update status. Please try again.');
    }
  };
  

  if (!order) {
    return <p>Order not available.</p>;
  }

  return (
    <div className="border border-gray-200 rounded-lg shadow p-4 mb-4">
      <h3 className="text-xl font-bold mb-2">Order #{order.orderNumber || 'N/A'}</h3>
      <p>Customer: {order.customerName || 'N/A'}</p>
      <p>Phone: {order.phone || 'N/A'}</p>
      <p>Type: {order.type || 'N/A'}</p>
      <p>Order Date: {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : 'N/A'}</p>

      <label htmlFor="status" className="block font-semibold mt-4">
        Status:
      </label>
      <select
        id="status"
        value={status}
        onChange={handleStatusChange}
        className="border rounded px-2 py-1 mt-1"
      >
        {statusOptions.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <h4 className="font-semibold mt-4">Items:</h4>
      <ul>
        {(order.items || []).map((item, index) => (
          <li key={index}>
            {item.itemName} - {item.quantity || 0} {item.unit || 'unit'} @ ${item.price || 0.0}
          </li>
        ))}
      </ul>
      <p className="font-bold mt-4">Total: ${order.total || 0.0}</p>
    </div>
  );
};

export default OrderCard;
