// Wishlist.js

import React, { useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { mycontext } from "./Context";
import Navbar from './Navbar';
import Footer from "./Footer";
import './Alluser';
import './wishlist.css' // Import your wishlist.css file

function Wishlist() {
  const { like, setLike, products } = useContext(mycontext);
  const navigate = useNavigate();

  const confirmRemove = (productData) => {
    if (window.confirm(`Removing ${productData.name} from the wishlist? `)) {
      handleRemove(productData._id);
    }
  }

  const handleRemove = (productId) => {
    const updatedLike = like.filter((item) => item !== productId);
    setLike(updatedLike);
  };

  function handleViewProduct(productId) {
    navigate(`/productview/${productId}`);
  }

  const filteredProducts = products.filter(product => like.includes(product._id));

  return (
    <div>
      <Navbar />
      <div className="whishlist-container" style={{ marginTop: '8%' }}>
        {like.length === 0 ? (
          <h1>Your wishlist is empty</h1>
        ) : (
          <div>
            {filteredProducts.map(item => (
              <div className="wishlist-item" key={item._id}>
                <h2>{item.category}</h2>
                <h4>{item.name}</h4>
                <img 
                  src={item.imageUrl} 
                  alt={item.name} 
                  onClick={() => handleViewProduct(item._id)} 
                />
                <p>Price: ₹{item.price}</p>
                <button onClick={() => confirmRemove(item)}>
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default Wishlist;
