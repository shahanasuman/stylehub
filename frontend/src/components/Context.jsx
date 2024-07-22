import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const mycontext = createContext();

export const MyContextProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [like, setLike] = useState([]);
  const [cart, setCart] = useState([]);
  const [LogUser, setLogUser] = useState({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/products');
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // useEffect(() => {
  //   if (LogUser.token) {
  //     fetchUsers().then(() => setLoading(false));
  //   } else {
  //     setLoading(false);
  //   }
  //   console.log('LogUser state:', LogUser); // Debugging statement
  // }, [LogUser.token]);

  // const fetchUsers = async () => {
  //   if (!LogUser.token) {
  //     console.error('Token is missing');
  //     return;
  //   }
  //   try {
  //     const response = await axios.get('http://localhost:5001/api/admin/users', {
  //       headers: {
  //         Authorization: `Bearer ${LogUser.token}`
  //       }
  //     });
  //     setUsers(response.data);
  //   } catch (error) {
  //     console.error('Fetch users error:', error.response ? error.response.data.message : error.message);
  //     if (error.response && error.response.status === 403) {
  //       // Handle 403 Forbidden (admin authorization required)
  //       // Example: redirect to login or display an error message
  //       // navigate('/login'); // Example redirection to login page
  //     }
  //   }
  // };
  
  

  const handleLike = async (productId) => {
    if (!LogUser.token) {
      console.error('Token is missing');
      alert('You need to log in to like a product');
      return;
    }
    try {
      const response = await axios.post(
        `http://localhost:5001/api/products/like/${productId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${LogUser.token}`
          }
        }
      );
      setLike(response.data.likes);
    } catch (error) {
      console.error('Error liking product:', error.response ? error.response.data.message : error.message);
    }
  };

  const handleCart = async (productId, removeFromCart = false) => {
    if (!LogUser.token) {
      console.error('Token is missing');
      alert('You need to log in to add/remove the item from the cart');
      return;
    }

    try {
      const product = products.find(item => item._id === productId);
      if (!product) {
        console.error(`Product with ID ${productId} not found.`);
        return;
      }

      if (!removeFromCart) {
        await axios.post(
          `http://localhost:5001/api/products/cart/${productId}`,
          { ...product, quantity: 1 },
          {
            headers: {
              Authorization: `Bearer ${LogUser.token}`
            }
          }
        );
        setCart(prevCart => [...prevCart, { ...product, quantity: 1 }]);
      } else {
        await axios.delete(
          `http://localhost:5001/api/products/cart/${productId}`,
          {
            headers: {
              Authorization: `Bearer ${LogUser.token}`
            }
          }
        );
        setCart(prevCart => prevCart.filter(item => item._id !== productId));
      }
    } catch (error) {
      console.error(`Error ${removeFromCart ? 'removing' : 'adding'} product to/from cart:`, error.response ? error.response.data.message : error.message);
    }
  };

  return (
    <mycontext.Provider value={{ products, setProducts, like, handleLike, setLike, setCart, handleCart, cart, LogUser, setLogUser, users, setUsers}}>
      {children}
    </mycontext.Provider>
  );
};
