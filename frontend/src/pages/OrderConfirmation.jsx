import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle, Download, Mail } from "lucide-react";
import { useApp } from "../context/RealAppContext";
import "./OrderConfirmation.css";

const OrderConfirmation = () => {
  const { orderId } = useParams();
  const { orders } = useApp();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    // Find the order by ID
    const foundOrder = orders.find((o) => o._id === orderId);
    if (foundOrder) {
      setOrder(foundOrder);
    }
  }, [orderId, orders]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!order) {
    return (
      <div className="order-confirmation-page">
        <div className="container">
          <div className="order-not-found">
            <h2>Order not found</h2>
            <p>
              The order you're looking for doesn't exist or has been removed.
            </p>
            <Link to="/orders" className="btn-primary">
              View All Orders
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="order-confirmation-page">
      <div className="container">
        <motion.div
          className="confirmation-header"
          initial={{ opacity: 0, y: 30, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6 }}
        >
          <div className="success-icon">
            <CheckCircle size={60} />
          </div>
          <h1>Order Confirmed!</h1>
          <p>
            Thank you for your purchase. Your order has been successfully
            placed.
          </p>
        </motion.div>

        <motion.div
          className="order-summary"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="summary-header">
            <h2>Order Summary</h2>
            <div className="order-meta">
              <p>
                <strong>Order #:</strong> {order._id.slice(-8)}
              </p>
              <p>
                <strong>Order Date:</strong> {formatDate(order.createdAt)}
              </p>
              <p>
                <strong>Payment Method:</strong> {order.paymentMethod}
              </p>
            </div>
          </div>

          <div className="order-items">
            <h3>Items Ordered</h3>
            {order.orderItems.map((item, index) => (
              <div key={index} className="confirmation-item">
                <img src={item.image} alt={item.name} />
                <div className="item-info">
                  <h4>{item.name}</h4>
                  <p>Quantity: {item.quantity}</p>
                  {item.size && <p>Size: {item.size}</p>}
                  {item.color && <p>Color: {item.color}</p>}
                </div>
                <div className="item-total">
                  ${(item.price * item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
          </div>

          <div className="order-totals">
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${order.itemsPrice.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Tax:</span>
              <span>${order.taxPrice.toFixed(2)}</span>
            </div>
            <div className="total-row">
              <span>Shipping:</span>
              <span>${order.shippingPrice.toFixed(2)}</span>
            </div>
            <div className="total-row final-total">
              <span>Total:</span>
              <span>${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="next-steps"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h3>What's Next?</h3>
          <div className="steps-grid">
            <div className="step">
              <Mail size={24} />
              <h4>Confirmation Email</h4>
              <p>We've sent a confirmation email with your order details.</p>
            </div>
            <div className="step">
              <CheckCircle size={24} />
              <h4>Order Processing</h4>
              <p>We'll process your order and prepare it for shipping.</p>
            </div>
            <div className="step">
              <Download size={24} />
              <h4>Tracking Info</h4>
              <p>We'll send you tracking information once your order ships.</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="confirmation-actions"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link to="/orders" className="btn-primary">
            View All Orders
          </Link>
          <Link to="/products" className="btn-secondary">
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
