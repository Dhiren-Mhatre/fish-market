import { useState } from 'react';
import SearchBar from '../components/Dashboard/SearchBar';
import OrderCard from '../components/Dashboard/OrderCard';
import { fetchOrderDetails } from '../api/orderDetails';
import './Dashboard.css'; // Import the styles for this component

const Dashboard = () => {
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');

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

  return (
    <div className="dashboard">
      <div className="logo-container">
        <img src="/logo.png" alt="Fish Market Logo" className="logo" />
      </div>
      <h1 className="dashboard-header">Fish Market Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="error-message">{error}</p>}
      {order && <OrderCard order={order} refreshOrders={handleSearch} />}
    </div>
  );
};

export default Dashboard;
