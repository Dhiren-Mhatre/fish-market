import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import OrderCardPage from './pages/OrderCardPage';
import './styles/globals.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/order/:orderId" element={<OrderCardPage />} />
      </Routes>
    </Router>
  );
}

export default App;
