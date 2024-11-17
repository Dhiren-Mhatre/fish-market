import { useState } from 'react';
import SearchBar from '../components/Dashboard/SearchBar';
import OrderCard from '../components/Dashboard/OrderCard';
import { fetchOrderDetails } from '../api/orderDetails';

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
    <div className="p-8 ">
      <h1 className="text-2xl font-bold text-center mb-6">Fish Market Dashboard</h1>
      <SearchBar onSearch={handleSearch} />
      {error && <p className="text-red-500 text-center">{error}</p>}
      {order && <OrderCard order={order} />}
    </div>
  );
};

export default Dashboard;
