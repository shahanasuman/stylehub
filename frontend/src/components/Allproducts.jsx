import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { mycontext } from './Context';
import './all.css'; // Ensure this file is correctly linked
import Navbaradmin from './Navbaradmin';

function Allproducts() {
  const { products, setProducts, LogUser } = useContext(mycontext);
  const [editedProduct, setEditedProduct] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    imageUrl: '',
    description: '',
    category: '',
    stock: ''
  });
  const [showAddProductForm, setShowAddProductForm] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:5001/api/products', {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  const deleteProduct = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`http://localhost:5001/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${LogUser.token}`
          }
        });
        const updatedProducts = products.filter(product => product._id !== id);
        setProducts(updatedProducts);
        console.log('Product deleted successfully');
      } catch (error) {
        console.error('Error deleting product:', error);
      }
    }
  };

  const handleEdit = (id) => {
    const productToEdit = products.find(product => product._id === id);
    setEditedProduct({ ...productToEdit });
  };

  const saveEdit = async (id, updatedProduct) => {
    try {
      await axios.put(`http://localhost:5001/api/products/${id}`, updatedProduct, {
        headers: {
          Authorization: `Bearer ${LogUser.token}`
        }
      });
      const updatedProducts = products.map(product =>
        product._id === id ? { ...product, ...updatedProduct } : product
      );
      setProducts(updatedProducts);
      setEditedProduct(null); // Reset editedProduct to close edit fields
      console.log('Product edited successfully');
    } catch (error) {
      console.error('Error saving product:', error);
    }
  };

  const addProduct = async () => {
    try {
      if (newProduct.name && newProduct.price && newProduct.imageUrl && newProduct.description && newProduct.category && newProduct.stock) {
        const response = await axios.post('http://localhost:5001/api/products/add', newProduct, {
          headers: {
            Authorization: `Bearer ${LogUser.token}`
          }
        });
        const addedProduct = response.data;
        const updatedProducts = [...products, addedProduct];
        setProducts(updatedProducts);
        setNewProduct({ name: '', price: '', imageUrl: '', description: '', category: '', stock: '' });
        setShowAddProductForm(false);
        console.log('Product added successfully');
      } else {
        setShowPopup(true); // Indicate that fields are required
      }
    } catch (error) {
      console.error('Error adding product:', error);
      if (error.response) {
        console.error('Error response data:', error.response.data);
        alert('Failed to add product. Please check your input and try again.');
      } else if (error.request) {
        console.error('No response received:', error.request);
        alert('No response received from server. Please try again later.');
      } else {
        console.error('Error occurred:', error.message);
        alert('An error occurred. Please try again.');
      }
    }
  };

  return (
    <div>
      <Navbaradmin />
      <div className='admin-products'>
        <div className='products-container'>
          <button
            className="add-product-btn"
            onClick={() => setShowAddProductForm(true)}
          >
            Add Product
          </button>
          <h2>All Products</h2>
          {showAddProductForm && (
            <div className="add-product-form">
              <input
                type="text"
                placeholder="Product Name"
                value={newProduct.name}
                onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Price"
                value={newProduct.price}
                onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newProduct.imageUrl}
                onChange={(e) => setNewProduct({ ...newProduct, imageUrl: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Category"
                value={newProduct.category}
                onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                required
              />
              <input
                type="text"
                placeholder="Stock"
                value={newProduct.stock}
                onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                required
              />
              <button onClick={addProduct}>Add Product</button>
            </div>
          )}
          {showPopup && (
            <div className="popup">
              <p>Please fill in all required fields.</p>
              <button onClick={() => setShowPopup(false)}>Close</button>
            </div>
          )}
          {products.map(product => (
            <div className='product' key={product._id}>
              {editedProduct && editedProduct._id === product._id ? (
                <div className="edit-product">
                  <img src={product.imageUrl} alt='product' />
                  <div>
                    <input
                      type="text"
                      value={editedProduct.name}
                      onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editedProduct.price}
                      onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editedProduct.imageUrl}
                      onChange={(e) => setEditedProduct({ ...editedProduct, imageUrl: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editedProduct.description}
                      onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editedProduct.category}
                      onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                    />
                    <input
                      type="text"
                      value={editedProduct.stock}
                      onChange={(e) => setEditedProduct({ ...editedProduct, stock: e.target.value })}
                    />
                    <button onClick={() => saveEdit(product._id, editedProduct)}>Save</button>
                  </div>
                </div>
              ) : (
                <div className="product-info">
                  <img src={product.imageUrl} alt='product' />
                  <h3>{product.name}</h3>
                  <p>{product.description}</p>
                  <p>₹{product.price}</p>
                  <div className="product-buttons">
                    <button onClick={() => deleteProduct(product._id)}>Delete</button>
                    <button onClick={() => handleEdit(product._id)}>Edit</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Allproducts;
