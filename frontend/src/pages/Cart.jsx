import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useApp } from "../context/RealAppContext";
import { motion } from "framer-motion";
import "./Cart.css";

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, user } = useApp();
  const navigate = useNavigate();

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(itemId);
    } else {
      updateCartItem(itemId, newQuantity);
    }
  };

  const handleCheckout = () => {
    if (!user) {
      navigate("/login?redirect=/checkout");
    } else {
      navigate("/checkout");
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="cart-page">
        <div className="container">
          <motion.div
            className="empty-cart"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="empty-cart-icon">🛒</div>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <Link to="/products" className="btn-primary">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="container">
        <motion.h1
          className="page-title"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Shopping Cart
        </motion.h1>

        <div className="cart-layout">
          <div className="cart-items">
            {cart.items.map((item, index) => (
              <motion.div
                key={item._id}
                className="cart-item"
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="item-image">
                  <img src={item.product.images[0]} alt={item.product.name} />
                </div>

                <div className="item-details">
                  <h3>{item.product.name}</h3>
                  <p className="item-description">{item.product.description}</p>

                  {item.size && (
                    <p className="item-variant">Size: {item.size}</p>
                  )}
                  {item.color && (
                    <p className="item-variant">Color: {item.color}</p>
                  )}

                  <div className="item-actions">
                    <div className="quantity-controls">
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity - 1)
                        }
                        className="quantity-btn"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(item._id, item.quantity + 1)
                        }
                        className="quantity-btn"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="remove-btn"
                    >
                      <Trash2 size={16} />
                      Remove
                    </button>
                  </div>
                </div>

                <div className="item-price">
                  <span className="price">${item.price * item.quantity}</span>
                  <span className="unit-price">${item.price} each</span>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="cart-summary"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h3>Order Summary</h3>

            <div className="summary-row">
              <span>
                Subtotal (
                {cart.items.reduce((acc, item) => acc + item.quantity, 0)}{" "}
                items)
              </span>
              <span>${cart.totalAmount}</span>
            </div>

            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>

            <div className="summary-row">
              <span>Tax</span>
              <span>${(cart.totalAmount * 0.08).toFixed(2)}</span>
            </div>

            <div className="summary-row total">
              <span>Total</span>
              <span>${(cart.totalAmount * 1.08).toFixed(2)}</span>
            </div>

            <button className="checkout-btn" onClick={handleCheckout}>
              Proceed to Checkout
            </button>

            <Link to="/products" className="continue-shopping">
              Continue Shopping
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
