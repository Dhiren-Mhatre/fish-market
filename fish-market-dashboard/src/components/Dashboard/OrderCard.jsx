import React, { useState } from "react";
import axios from "axios";
import "./OrderCard.css"; // Import the styles for this component

const OrderCard = ({ order, refreshOrders }) => {
  const [status, setStatus] = useState(order.status || "Pending");
  const statusOptions = ["Pending", "Delivered"];

  const handleStatusChange = async (event) => {
    const newStatus = event.target.value;
    setStatus(newStatus);

    try {
      const backendUrl = "https://fish-martket-backend.onrender.com";
      await axios.put(`${backendUrl}/api/order-details/${order._id}`, {
        status: newStatus,
      });
      if (refreshOrders) refreshOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  if (!order) {
    return <p className="no-order">Order not available.</p>;
  }

  return (
    
    <div className="order-card">
     
      <h3 className="order-header">Order #{order.orderNumber || "N/A"}</h3>
      <div className="order-details">
  <p>
    <span className="detail-label">Customer:</span> {order.customerName || "N/A"}
  </p>
  <p>
    <span className="detail-label">Phone:</span> {order.phone || "N/A"}
  </p>
  <p>
    <span className="detail-label">Mobile:</span> {order.mobile || "N/A"}
  </p>
  <p>
    <span className="detail-label">Event:</span> {order.type || "N/A"}
  </p>
  <p>
    <span className="detail-label">Order Date:</span>{" "}
    {order.orderDate ? new Date(order.orderDate).toLocaleDateString() : "N/A"}
  </p>
</div>



      
      <h4 className="items-header">Items:</h4>
      <table className="item-table">
        <thead>
          <tr>
            <th>Item Name</th>
            <th>Quantity</th>
            <th>Unit</th>
            <th>Price</th>
            <th>Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {(order.items || []).map((item, index) => (
            <tr key={index}>
              <td>{item.itemName}</td>
              <td>{item.quantity || 0}</td>
              <td>{item.unit || "unit"}</td>
              <td>${item.price || 0.0}</td>
              <td>${(item.quantity || 0) * (item.price || 0.0)}</td>
            </tr>
          ))}
          <tr>
            <td colSpan="4" style={{ textAlign: "left" }}>
              Packing Fee
            </td>
            <td>$10</td>
          </tr>
          <tr>
            <td colSpan="4" style={{ textAlign: "left" }}>
              Total
            </td>
            <td>${order.total || 0.0}</td>
          </tr>
        </tbody>
      </table>
      <div className="status-section">
        <label htmlFor="status" className="status-label">
          Status:
        </label>
        <select
          id="status"
          value={status}
          onChange={handleStatusChange}
          className="status-select small-dropdown"
        >
          {statusOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

    </div>
  );
};

export default OrderCard;
