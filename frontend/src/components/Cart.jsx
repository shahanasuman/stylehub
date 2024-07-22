import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { mycontext } from './Context';
import Footer from './Footer';
import Navbar from './Navbar';
import './cart.css';

function Cart() {
  const { cart, setCart } = useContext(mycontext);
  const [cartTotal, setCartTotal] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("Cart contents:", cart); // Log cart contents for debugging

    const calculateCartTotal = () => {
      return cart.reduce((total, item) => {
        const quantity = item.quantity || 1;
        const price = item.price || 0;
        return total + price * quantity;
      }, 0);
    };
    setCartTotal(calculateCartTotal());
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const incrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCart(updatedCart);
  };

  const decrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCart(updatedCart);
  };

  const handleRemove = (productId) => {
    const updatedCart = cart.filter((item) => item._id !== productId);
    setCart(updatedCart);
  };

  const buyNow = (product) => {
    navigate('/Buypage', { state: { product } });
  };

  const totalBuy = () => {
    navigate('/Buypage', { state: { cart } });
  };

  return (
    <div>
      <Navbar />
      <div className="" style={{ marginTop: '8%' }}>
        {cart.length === 0 ? (
          <h1>Your cart is empty</h1>
        ) : (
          <div className="watch">
            <h1>Manage your cart</h1>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Total</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cart.map((product) => (
                  <tr key={product._id}>
                    <td>
                      <div>
                        <img src={product.imageUrl} alt="Product" style={{ width: '100px' }} />
                        <p>{product.name}</p><br/>
                        <p>{product.description}</p>
                      </div>
                    </td>
                    <td>₹ {product.price}</td>
                    <td>
                      <div className="quantity-control">
                        <button onClick={() => decrementQuantity(product._id)}>-</button>
                        <span>{product.quantity}</span>
                        <button onClick={() => incrementQuantity(product._id)}>+</button>
                      </div>
                    </td>
                    <td>₹ {(product.price * (product.quantity || 1)).toFixed(2)}</td>
                    <td>
                      <button onClick={() => handleRemove(product._id)} className="remove-button">Remove</button>
                      <button onClick={() => buyNow(product)} className="buy-now-button">Buy Now</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div>
              <h3>Subtotal: ₹ {cartTotal.toFixed(2)}</h3>
            </div>
            <div className="order">
              <button onClick={totalBuy} style={{ backgroundColor: 'orange', fontSize: 'large' }}>Order Now</button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Cart;
