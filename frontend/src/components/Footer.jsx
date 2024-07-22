import React from 'react';
import './footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__section">
          <h1>About</h1>
          <ul>
            <li key="about-us">About us</li>
            <li key="careers">Careers</li>
            <li key="take-tour">Take a Tour</li>
            <li key="blog">Blog</li>
            <li key="store-locator">Store Locator</li>
            <li key="landmark-cares">Landmark Cares</li>
          </ul>
        </div>
        <div className="footer__section">
          <h1>Help</h1>
          <ul>
            <li key="contact-us">Contact us</li>
            <li key="shipping">Shipping</li>
            <li key="returns-process">Returns Process</li>
            <li key="returns-policy">Returns Policy</li>
            <li key="help-centre">Help Centre</li>
          </ul>
        </div>
        <div className="footer__section">
          <h1>Explore</h1>
          <ul>
            <li key="online-offers">Online Offers</li>
            <li key="store-offers">Store Offers</li>
            <li key="fashion-vlog">Fashion VLOG</li>
            <li key="online-gift-card">Online Gift Card</li>
            <li key="stores-nearby">Stores Nearby</li>
            <li key="store-gift-card">Store Gift Card</li>
            <li key="homecentre">Homecentre</li>
          </ul>
        </div>
        <div className="footer__social">
          {/* Social media icons */}
          <a href="https://fontawesome.com/icons/square-facebook?f=brands&s=solid"><i className="fab fa-facebook-f"></i></a>
          <a href="#"><i className="fab fa-twitter"></i></a>
          <a href="#"><i className="fab fa-instagram"></i></a>
        </div>
      </div>
      <div className="footer__copyright">
        {/* Copyright text */}
        <p>© 2024 Your Company. All rights reserved.</p>
      </div>
    </footer>
  );
}

export default Footer;