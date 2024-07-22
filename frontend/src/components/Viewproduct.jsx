import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { mycontext } from "./Context";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import heart from "./icon/heart-solid.svg";
import heart1 from "./icon/heart1.svg";
import carticon from "./icon/cart-shopping-solid.svg";
import cartplus from "./icon/cart-plus-solid.svg";
import './viewproduct.css';

function ViewProduct() {
  const { id } = useParams();
  const { LogUser, like, cart, setCart, handleLike, handleCart, products } = useContext(mycontext);
  const [productDetails, setProductDetails] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5001/api/products/${id}`);
        setProductDetails(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };
    fetchProductDetails();
  }, [id]);

  if (!productDetails) {
    return <div>Loading...</div>;
  }

  function likel(itemId) {
    if (!LogUser || Object.keys(LogUser).length === 0) {
      alert("Please log in to like/unlike the item!");
      navigate("/login");
      return;
    }
    handleLike(itemId);
  }

  async function cartl(itemId) {
    if (!LogUser.token) {
      alert('Please log in to add/remove the item from the cart!');
      navigate('/login');
      return;
    }

    try {
      const isInCart = cart.some(cartItem => cartItem._id === itemId);

      if (isInCart) {
        await handleCart(itemId, false);
        setCart(prevCart => prevCart.filter(item => item._id !== itemId));
      } else {
        const product = products.find(item => item._id === itemId);
        await handleCart(itemId, true);
        setCart(prevCart => [...prevCart, { ...product, quantity }]);
      }
    } catch (error) {
      console.error("Failed to update cart:", error.message);
      alert("Failed to update cart. Please try again later.");
    }
  }

  const incrementQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity(prevQuantity => prevQuantity - 1);
    }
  };

  function placeOrder() {
    if (!LogUser || !LogUser.token) {
      alert('Please log in to place an order!');
      navigate('/login');
      return;
    }
    navigate('/Buypage', { state: { product: { ...productDetails, quantity } } });
  }

  return (
    <div>
      <Navbar />
      <div className="product-details">
        <img src={productDetails.imageUrl} alt="Product" width={300} height={400} />
        <p>{productDetails.name}</p>
        <p>{productDetails.description}</p>
        <p>₹{productDetails.price}</p>
        <div className="button-container">
          <button onClick={() => likel(productDetails._id)} className="like-button">
            {like.includes(productDetails._id) ? (
              <img src={heart} alt="Liked" />
            ) : (
              <img src={heart1} alt="Not Liked" />
            )}
          </button>
          <button onClick={() => cartl(productDetails._id)} className="cart-button">
            {cart.some((item) => item._id === productDetails._id) ? (
              <img src={carticon} alt="In Cart" />
            ) : (
              <img src={cartplus} alt="Not in Cart" />
            )}
          </button>
        </div>
        <div className="quantity-control">
          <button onClick={decrementQuantity}>-</button>
          <span>{quantity}</span>
          <button onClick={incrementQuantity}>+</button>
        </div>
        <button onClick={placeOrder} style={{ backgroundColor: "orange", fontSize: "large", marginTop: "10px" }}>
          Order Now
        </button>
      </div>
      <Footer />
    </div>
  );
}

export default ViewProduct;
