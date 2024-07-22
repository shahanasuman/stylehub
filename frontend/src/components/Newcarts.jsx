import React, { useContext } from 'react';
import { mycontext } from './Context';

export default function Newcarts({ product }) {
  const { cart, setCart } = useContext(mycontext);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return; // Prevent quantity from going below 1
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: newQuantity } : item
    );
    setCart(updatedCart);
  };

  const decrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: Math.max((item.quantity || 1) - 1, 1) } : item
    );
    setCart(updatedCart);
  };

  const incrementQuantity = (productId) => {
    const updatedCart = cart.map((item) =>
      item._id === productId ? { ...item, quantity: (item.quantity || 1) + 1 } : item
    );
    setCart(updatedCart);
  };

  return (
    <div>
      <button onClick={() => decrementQuantity(product._id)}>-</button>
      <span>{product.quantity || 1}</span>
      <button onClick={() => incrementQuantity(product._id)}>+</button>
    </div>
  );
}
