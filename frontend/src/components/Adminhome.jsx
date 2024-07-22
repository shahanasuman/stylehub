import React from 'react';
import { useNavigate } from 'react-router-dom';
import './adminhome.css';
import Navbaradmin from './Navbaradmin';

function Adminhome() {
  const nav = useNavigate();

  function allUser() {
    nav('/alluser');
  }

  function allProducts() {
    nav('/allproducts');
  }

  function allOrders() {
    nav('/allorders'); // Assuming the route for All Orders page is '/allorders'
  }

  return (
    <div className='admin-container'>
      <Navbaradmin />
      <div className='admin-content'>
        <div className='title-container'>
          <h3 className='content-title'>Manage your store</h3>
        </div>
        <div className='button-container'>
          <button className="button" onClick={allProducts}>All Products</button>
          <button className="button" onClick={allUser}>All Users</button>
          <button className="button" onClick={allOrders}>All Orders</button> {/* New All Orders button */}
        </div>
      </div>
    </div>
  );
}

export default Adminhome;
