import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, User, Search, Menu, X } from "lucide-react";
import { useApp } from "../context/RealAppContext";
import "./Navbar.css";

const Navbar = () => {
  const { user, cart, logout } = useApp();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const cartItemsCount =
    cart.items?.reduce((total, item) => total + item.quantity, 0) || 0;

  const handleLogout = () => {
    logout();
    navigate("/");
    setIsUserMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          🍎
        </Link>

        {/* Desktop Menu */}
        <div className="nav-menu">
          <Link to="/products?category=Mac" className="nav-item">
            Mac
          </Link>
          <Link to="/products?category=iPad" className="nav-item">
            iPad
          </Link>
          <Link to="/products?category=iPhone" className="nav-item">
            iPhone
          </Link>
          <Link to="/products?category=Watch" className="nav-item">
            Watch
          </Link>
          <Link to="/products?category=AirPods" className="nav-item">
            AirPods
          </Link>
          <Link to="/products?category=TV & Home" className="nav-item">
            TV & Home
          </Link>
          <Link to="/products?category=Accessories" className="nav-item">
            Accessories
          </Link>
        </div>

        {/* Right Side Icons */}
        <div className="nav-actions">
          <button className="nav-icon">
            <Search size={16} />
          </button>

          {/* User Menu */}
          <div className="user-menu">
            <button
              className="nav-icon"
              onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            >
              <User size={16} />
            </button>

            {isUserMenuOpen && (
              <div className="user-dropdown">
                {user ? (
                  <>
                    <div className="user-info">
                      <span>Hello, {user.name}</span>
                    </div>
                    <Link to="/orders" onClick={() => setIsUserMenuOpen(false)}>
                      My Orders
                    </Link>
                    <Link
                      to="/profile"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Profile
                    </Link>
                    {user.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsUserMenuOpen(false)}
                        style={{ color: '#007aff', fontWeight: 'bold' }}
                      >
                        Admin Panel
                      </Link>
                    )}
                    <button onClick={handleLogout}>Logout</button>
                  </>
                ) : (
                  <>
                    <Link to="/login" onClick={() => setIsUserMenuOpen(false)}>
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsUserMenuOpen(false)}
                    >
                      Create Account
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link to="/cart" className="nav-icon cart-icon">
            <ShoppingCart size={16} />
            {cartItemsCount > 0 && (
              <span className="cart-badge">{cartItemsCount}</span>
            )}
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="mobile-menu-btn"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="mobile-menu">
          <Link
            to="/products?category=Mac"
            onClick={() => setIsMenuOpen(false)}
          >
            Mac
          </Link>
          <Link
            to="/products?category=iPad"
            onClick={() => setIsMenuOpen(false)}
          >
            iPad
          </Link>
          <Link
            to="/products?category=iPhone"
            onClick={() => setIsMenuOpen(false)}
          >
            iPhone
          </Link>
          <Link
            to="/products?category=Watch"
            onClick={() => setIsMenuOpen(false)}
          >
            Watch
          </Link>
          <Link
            to="/products?category=AirPods"
            onClick={() => setIsMenuOpen(false)}
          >
            AirPods
          </Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
