import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { mycontext } from './Context';
import axios from 'axios';
import Navbar from './Navbar';
import Footer from './Footer';
import './ordersummary.css';

const OrderSummaryPage = () => {
  const { LogUser } = useContext(mycontext);
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    if (LogUser.user) {
      fetchOrders();
    }

    return () => {
      prevLocation.current = location;
    };
  }, [LogUser.user, location]);

  useEffect(() => {
    if (prevLocation.current.pathname === '/Buypage') {
      navigate('/');
    }
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/orders/user/${LogUser.user._id}`, {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
      setOrders(response.data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
    }
  };

  const calculateDeliveryStatus = (orderDate, deliveryDate) => {
    const currentDate = new Date();
    const actualDeliveryDate = new Date(deliveryDate);
    return currentDate >= actualDeliveryDate ? 'Delivered' : 'Processing';
  };

  const handleCancelOrder = async (orderId) => {
    try {
      const response = await axios.delete(`http://localhost:5001/api/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
      if (response.status === 200) {
        alert('Order cancelled successfully!');
        fetchOrders();
      } else {
        console.error('Failed to cancel order:', response.data.message);
        alert('Failed to cancel order. Please try again later.');
      }
    } catch (error) {
      console.error('Error cancelling order:', error.response ? error.response.data.message : error.message);
      alert('Failed to cancel order. Please try again later.');
    }
  };

  if (!LogUser.user) {
    return (
      <div>
        <h2>Please log in to view your orders.</h2>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div>
        <h2>No orders placed yet.</h2>
        <button onClick={() => navigate('/')}>Go to Home</button>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="order-summary-page">
        <h2>Order Summary</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Order Date</th>
                <th>Delivery Address</th>
                <th>Order Items</th>
                <th>Total Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index} className="order-item">
                  <td>Order {index + 1}</td>
                  <td>{order.orderDate ? new Date(order.orderDate).toLocaleString() : 'Date not available'}</td>
                  <td>{order.address || 'Address not available'}</td>
                  <td>
                    <ul>
                      {order.orderItems && order.orderItems.map((item, idx) => (
                        <li key={idx}>
                          {item.product ? `${item.product.name} - ₹${item.product.price} - Quantity: ${item.quantity}` : 'Product details not available'}
                        </li>
                      ))}
                    </ul>
                  </td>
                  <td>₹{order.totalAmount.toFixed(2)}</td>
                  <td>{calculateDeliveryStatus(order.orderDate, order.deliveryDate)}</td>
                  <td>
                    <button onClick={() => handleCancelOrder(order._id)}>Cancel Order</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default OrderSummaryPage;
