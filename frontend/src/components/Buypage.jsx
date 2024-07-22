import React, { useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { mycontext } from './Context';
import Navbar from './Navbar';
import Footer from './Footer';
import axios from 'axios';
import './buypage.css'; // Import your CSS file for styling

const BuyPage = () => {
  const { cart, setCart, LogUser } = useContext(mycontext);
  const [address, setAddress] = useState('');
  const [place, setPlace] = useState('');
  const [city, setCity] = useState('');
  const [pincode, setPincode] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [editAddress, setEditAddress] = useState(false); // Initially false
  const [orderItems, setOrderItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [previousAddresses, setPreviousAddresses] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  // Function to fetch addresses for the logged-in user
  const fetchAddresses = async () => {
    try {
      const response = await axios.get(`http://localhost:5001/api/orders/addresses/${LogUser.user._id}`, {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
      console.log('Fetched addresses:', response.data); // Debug log
      setPreviousAddresses(response.data.previousAddresses); // Update previousAddresses state
    } catch (error) {
      console.error('Error fetching addresses:', error);
    }
  };

  // Load previous addresses from server when the component mounts
  useEffect(() => {
    if (LogUser.user) {
      fetchAddresses();
    }
  }, [LogUser.user]);

  useEffect(() => {
    // Get product details from location state if coming from ViewProduct page
    if (location.state && location.state.product) {
      setOrderItems([location.state.product]);
    } else if (location.state && location.state.cart) {
      setOrderItems(location.state.cart);
    } else {
      setOrderItems(cart);
    }
  }, [location.state, cart]);

  useEffect(() => {
    const calculateTotalAmount = () => {
      return orderItems.reduce((total, item) => {
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        return total + price * quantity;
      }, 0);
    };
    setTotalAmount(calculateTotalAmount());
  }, [orderItems]);

  const handleAddressSubmit = async (e) => {
    e.preventDefault();

    const newAddress = {
      place,
      city,
      pincode,
      phoneNumber
    };

    try {
      const response = await axios.post(`http://localhost:5001/api/orders/addresses/${LogUser.user._id}`, newAddress, {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
      if (response.status === 201) {
        // Refresh addresses after adding a new one
        fetchAddresses(); // Fetch updated addresses
        setPlace('');
        setCity('');
        setPincode('');
        setPhoneNumber('');
        setEditAddress(false);
      } else {
        console.error('Failed to save address:', response.data.message);
        alert('Failed to save address. Please try again later.');
      }
    } catch (error) {
      console.error('Error saving address:', error.response ? error.response.data.message : error.message);
      alert('Failed to save address. Please try again later.');
    }
  };

  const handleOrderNow = async () => {
    if (!address) {
      alert('Please select or enter an address.');
      return;
    }
  
    const validatedOrderItems = orderItems.map(item => ({
      product: item._id,
      quantity: item.quantity || 1
    }));
  
    const order = {
      userId: LogUser.user._id,
      orderItems: validatedOrderItems,
      address,
      totalAmount,
      status: 'Processing',
      orderDate: new Date()
    };
  
    try {
      console.log('Placing order:', order); // Debug log
      const response = await axios.post('http://localhost:5001/api/orders', order, {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
  
      if (response.status === 201) {
        alert('Order placed successfully!');
        const orderedProductIds = orderItems.map(item => item._id);
        const updatedCart = cart.filter(item => !orderedProductIds.includes(item._id));
        setCart(updatedCart);
        navigate('/orders');
      } else {
        console.error('Failed to place order:', response.data.message);
        alert('Failed to place order. Please try again later.');
      }
    } catch (error) {
      console.error('Error placing order:', error.response ? error.response.data.message : error.message);
      alert('Failed to place order. Please try again later.');
    }
  };
  
  const handleAddressChange = (selectedAddress) => {
    // Find the selected address from previous addresses
    const selected = previousAddresses.find((addr) => addr.place === selectedAddress);
    if (selected) {
      setAddress(selected.place);
      setPlace(selected.place);
      setCity(selected.city);
      setPincode(selected.pincode);
      setPhoneNumber(selected.phoneNumber);
    }
    setEditAddress(false); // Automatically set edit mode to false when selecting a previous address
  };

  // Validation functions
  const isAlphabetic = (value) => /^[a-zA-Z\s]+$/.test(value);
  const isNumeric = (value) => /^[0-9]+$/.test(value);

  return (
    <div>
      <Navbar />
      <div className="buy-page">
        <h2>Checkout</h2>
        <div>
          <h3>Delivery Address</h3>
          <div className="address-options">
            {previousAddresses.map((addr, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={`address_${index}`}
                  name="previousAddresses"
                  checked={address === addr.place}
                  onChange={() => handleAddressChange(addr.place)}
                />
                <label htmlFor={`address_${index}`}>
                  {addr.place}, {addr.city}, {addr.pincode}, {addr.phoneNumber}
                </label>
              </div>
            ))}
            <button onClick={() => setEditAddress(true)}>Add New Address</button>
          </div>
        </div>
        {editAddress && (
          <form onSubmit={handleAddressSubmit}>
            <div className="address-form">
              <label>
                Place:
                <input
                  type="text"
                  value={place}
                  onChange={(e) => setPlace(e.target.value)}
                  required
                  pattern="[a-zA-Z\s]+"
                  title="Place must be alphabetic"
                />
              </label>
              <label>
                City:
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  required
                  pattern="[a-zA-Z\s]+"
                  title="City must be alphabetic"
                />
              </label>
              <label>
                Pincode:
                <input
                  type="text"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  required
                  pattern="[0-9]+"
                  title="Pincode must be numeric"
                />
              </label>
              <label>
                Phone Number:
                <input
                  type="text"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  required
                  pattern="[0-9]+"
                  title="Phone number must be numeric"
                />
              </label>
              <button type="submit">Save Address</button>
            </div>
          </form>
        )}

        {orderItems.length > 0 && (
          <>
            <h3>Order Summary</h3>
            <table className="order-summary">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((item) => (
                  <tr key={item._id}>
                    <td>
                      <div>
                        <img src={item.imageUrl} alt={item.name} style={{ width: '100px' }} />
                        <p>{item.name}</p>
                        <p>{item.description}</p>
                      </div>
                    </td>
                    <td>₹ {item.price}</td>
                    <td>{item.quantity || 1}</td>
                    <td>₹ {(item.price * (item.quantity || 1)).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="order-total">
              <h3>Total Amount: ₹ {totalAmount.toFixed(2)}</h3>
            </div>

            <button onClick={handleOrderNow} className="place-order-button">
              Place Order
            </button>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default BuyPage;
