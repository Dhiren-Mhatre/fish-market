import { useParams, useNavigate } from 'react-router-dom';
import OrderCard from '../components/Dashboard/OrderCard';
import SearchBar from '../components/Dashboard/SearchBar';
import { useState, useEffect } from 'react';
import axios from 'axios';
import './OrderCardPage.css';

const OrderCardPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const backendUrl = 'https://fish-martket-backend.onrender.com';
        const response = await axios.get(`${backendUrl}/api/order-details/${orderId}`);
        setOrder(response.data);
      } catch (error) {
        console.error('Error fetching order:', error);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="order-card-page">
      <button onClick={() => navigate('/')} className="home-button">Home</button>
      <SearchBar onSearch={(query) => console.log(query)} />
      {order ? <OrderCard order={order} /> : <p>Loading order details...</p>}
    </div>
  );
};

export default OrderCardPage;
