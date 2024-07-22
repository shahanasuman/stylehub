import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Navbaradmin from './Navbaradmin';
import Footer from './Footer';
import { mycontext } from './Context';
import './allorders.css'

const AllOrdersPage = () => {
  const { LogUser } = useContext(mycontext);
  const [usersWithOrders, setUsersWithOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalProfit, setTotalProfit] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    if (LogUser.user) {
      fetchUsersWithOrders();
    }
  }, [LogUser.user]);

  const fetchUsersWithOrders = async () => {
    try {
      setLoading(true);
      const usersResponse = await axios.get('http://localhost:5001/api/admin/users', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });

      const userOrdersPromises = usersResponse.data.map(async (user) => {
        try {
          const ordersResponse = await axios.get(`http://localhost:5001/api/orders/user/${user._id}`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
          });

          if (ordersResponse.data.orders.length > 0) {
            return { ...user, orders: ordersResponse.data.orders };
          } else {
            return null;
          }
        } catch (error) {
          console.error(`Error fetching orders for user ${user.email}:`, error);
          return null;
        }
      });

      const usersWithOrdersData = await Promise.all(userOrdersPromises);
      const filteredUsersWithOrders = usersWithOrdersData.filter((user) => user !== null);

      // Calculate total profit
      let totalProfit = 0;
      filteredUsersWithOrders.forEach(user => {
        user.orders.forEach(order => {
          totalProfit += (order.totalAmount * 0.2);
        });
      });

      setUsersWithOrders(filteredUsersWithOrders);
      setTotalProfit(totalProfit);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching users and orders:', error);
      if (error.response && error.response.status === 403) {
        navigate('/login');
      }
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbaradmin />
      <div className="all-orders-page">
        <h2>All Users and Their Orders</h2>
        {loading ? (
          <p>Loading users and orders...</p>
        ) : usersWithOrders.length > 0 ? (
          usersWithOrders.map((user) => (
            <div key={user._id} className="user-orders">
              <h3>{user.email}</h3>
              <table>
                <thead>
                  <tr>
                    <th>Order #</th>
                    <th>Order Date</th>
                    <th>Delivery Address</th>
                    <th>Order Items</th>
                    <th>Total Amount</th>
                    <th>Profit (20%)</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {user.orders.map((order, index) => (
                    <tr key={index}>
                      <td>{index + 1}</td>
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
                      <td>₹{(order.totalAmount * 0.2).toFixed(2)}</td>
                      <td>{order.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))
        ) : (
          <p>No users with orders found.</p>
        )}
        <div className="total-profit">
          <h3>Total Profit: ₹{totalProfit.toFixed(2)}</h3>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AllOrdersPage;
