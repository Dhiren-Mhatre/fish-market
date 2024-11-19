import { useState, useEffect } from 'react';
import SearchBar from '../components/Dashboard/SearchBar';
import OrderCard from '../components/Dashboard/OrderCard';
import { fetchOrderDetails } from '../api/orderDetails';
import axios from 'axios';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [orders, setOrders] = useState([]);
  const [order, setOrder] = useState(null); // Add this line
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async (orderNumber) => {
    setError('');
    setOrder(null);
    try {
      const result = await fetchOrderDetails(orderNumber);
      setOrder(result);
    } catch (err) {
      setError('Order not found');
    }
  };

  const fetchAllOrders = async () => {
    try {
      const backendUrl = 'https://fish-martket-backend.onrender.com';
      const response = await axios.get(`${backendUrl}/api/order-details`);
      const pendingOrders = response.data
        .filter((order) => order.status === 'Pending')
        .sort((a, b) => new Date(a.orderDate) - new Date(b.orderDate));
      setOrders(pendingOrders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const backendUrl = 'https://fish-martket-backend.onrender.com';
      await axios.put(`${backendUrl}/api/order-details/${orderId}`, { status: newStatus });
      fetchAllOrders();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  const handleRowClick = (orderId) => {
    navigate(`/order/${orderId}`);
  };

  return (
    <div className="dashboard">
      <div className="logo-container">
        <img src="/logo.png" alt="Fish Market Logo" className="logo" />
      </div>
      <h1 className="dashboard-header">Fish Market Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="error-message">{error}</p>}
      {order && <OrderCard order={order} refreshOrders={fetchAllOrders} />}
      <h2 className="orders-list-header">Orders Table</h2>
      <div className="orders-table-wrapper">
        <table className="orders-table">
          <thead>
            <tr>
              <th>Order #</th>
              <th>Customer</th>
              <th>Phone</th>
              <th>Mobile</th>
              <th>Order Date</th>
              <th>Event</th>
              <th>Total Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((ord) => (
              <tr
                key={ord._id}
                onClick={() => handleRowClick(ord._id)}
                className="order-row"
              >
                <td>{ord.orderNumber}</td>
                <td>{ord.customerName || 'N/A'}</td>
                <td>{ord.phone || 'N/A'}</td>
                <td>{ord.mobile || 'N/A'}</td>
                <td>{new Date(ord.orderDate).toLocaleDateString() || 'N/A'}</td>
                <td>{ord.type || 'N/A'}</td>
                <td>${ord.total || '0.00'}</td>
                <td>
                  <select
                    value={ord.status || 'Pending'}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => updateOrderStatus(ord._id, e.target.value)}
                    className="status-dropdown"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Delivered">Delivered</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Dashboard;
