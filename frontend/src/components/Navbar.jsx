import React, { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mycontext } from './Context';
import './Navbar.css';
import cartIcon from './icon/cart-shopping-solid.svg';
import heartIcon from './icon/heart-solid.svg';

function Navbar() {
  const { LogUser, setLogUser, like, cart } = useContext(mycontext);
  const navigate = useNavigate();
  const [isNavOpen, setIsNavOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setLogUser({ token, user: JSON.parse(user) });
    } else {
      setLogUser({ token: null, user: null });
    }
  }, [setLogUser]);

  const logoutBtn = () => {
    setLogUser({ token: null, user: null });
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleMen = () => navigate('/men');
  const handleWomen = () => navigate('/women');
  const handleKid = () => navigate('/kid');
  const login = () => navigate('/login');
  const home = () => navigate('/');
  const order = () => navigate('/orders');

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  return (
    <div className='navbar'>
      <div className='nav-container'>
        <h2 className='title' onClick={home}>StyleHub</h2>
        <button className="nav-toggle" onClick={toggleNav}>
          ☰
        </button>
        <div className={`nav-links ${isNavOpen ? 'open' : ''}`}>
          <h2 onClick={handleMen}>Men</h2>
          <h2 onClick={handleWomen}>Women</h2>
          <h2 onClick={handleKid}>Kids</h2>
          <h2 onClick={order}>Orders</h2>
          <Link to={"/wishlist"}>
            <div className="icon-container">
              <img src={heartIcon} alt='like' />
              {like.length > 0 && <span className="item-count">{like.length}</span>}
            </div>
          </Link>
          <Link to={"/cart"}>
            <div className="icon-container">
              <img src={cartIcon} alt='cart' />
              {cart.length > 0 && <span className="item-count">{cart.length}</span>}
            </div>
          </Link>
          {LogUser.token ? (
            <button onClick={logoutBtn} className="logout-btn">Logout</button>
          ) : (
            <button onClick={login} className="login-btn">Login</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Navbar;
