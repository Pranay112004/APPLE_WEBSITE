import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-section">
            <h4>Shop and Learn</h4>
            <ul>
              <li>
                <Link to="/products?category=Mac">Mac</Link>
              </li>
              <li>
                <Link to="/products?category=iPad">iPad</Link>
              </li>
              <li>
                <Link to="/products?category=iPhone">iPhone</Link>
              </li>
              <li>
                <Link to="/products?category=Watch">Watch</Link>
              </li>
              <li>
                <Link to="/products?category=AirPods">AirPods</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Account</h4>
            <ul>
              <li>
                <Link to="/profile">Manage Your Apple ID</Link>
              </li>
              <li>
                <Link to="/orders">Apple Store Account</Link>
              </li>
              <li>
                <Link to="#">iCloud.com</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>Apple Store</h4>
            <ul>
              <li>
                <Link to="#">Find a Store</Link>
              </li>
              <li>
                <Link to="#">Genius Bar</Link>
              </li>
              <li>
                <Link to="#">Today at Apple</Link>
              </li>
              <li>
                <Link to="#">Apple Summer Camp</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Business</h4>
            <ul>
              <li>
                <Link to="#">Apple and Business</Link>
              </li>
              <li>
                <Link to="#">Shop for Business</Link>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h4>For Education</h4>
            <ul>
              <li>
                <Link to="#">Apple and Education</Link>
              </li>
              <li>
                <Link to="#">Shop for Education</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-legal">
            <p>Copyright © 2024 Apple Inc. All rights reserved.</p>
            <div className="footer-links">
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Use</Link>
              <Link to="#">Sales and Refunds</Link>
              <Link to="#">Site Map</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
