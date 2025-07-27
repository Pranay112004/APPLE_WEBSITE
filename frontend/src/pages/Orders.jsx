import React from "react";
import { motion } from "framer-motion";
import { Package, Clock, CheckCircle, Truck } from "lucide-react";
import { useApp } from "../context/RealAppContext";
import "./Orders.css";

const Orders = () => {
  const { orders, user } = useApp();

  const getStatusIcon = (status) => {
    switch (status) {
      case "Order Placed":
        return <Clock size={16} className="status-icon pending" />;
      case "Shipped":
        return <Truck size={16} className="status-icon shipped" />;
      case "Delivered":
        return <CheckCircle size={16} className="status-icon delivered" />;
      default:
        return <Package size={16} className="status-icon" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!user) {
    return (
      <div className="orders-page">
        <div className="container">
          <div className="not-logged-in">
            <h2>Please log in to view your orders</h2>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div className="container">
        <motion.div
          className="orders-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>My Orders</h1>
          <p>
            {orders.length} order{orders.length !== 1 ? "s" : ""} found
          </p>
        </motion.div>

        {orders.length === 0 ? (
          <motion.div
            className="no-orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Package size={80} />
            <h3>No orders yet</h3>
            <p>When you place orders, they'll appear here.</p>
            <button
              className="btn-primary"
              onClick={() => (window.location.href = "/products")}
            >
              Start Shopping
            </button>
          </motion.div>
        ) : (
          <div className="orders-list">
            {orders.map((order, index) => (
              <motion.div
                key={order._id}
                className="order-card"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order._id.slice(-8)}</h3>
                    <p className="order-date">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="order-status">
                    {getStatusIcon(order.status)}
                    <span
                      className={`status-text ${order.status
                        .toLowerCase()
                        .replace(" ", "-")}`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="order-items">
                  {order.orderItems.map((item, itemIndex) => (
                    <div key={itemIndex} className="order-item">
                      <img src={item.image} alt={item.name} />
                      <div className="item-details">
                        <h4>{item.name}</h4>
                        <p>Quantity: {item.quantity}</p>
                        {item.size && <p>Size: {item.size}</p>}
                        {item.color && <p>Color: {item.color}</p>}
                      </div>
                      <div className="item-price">
                        ${(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="order-footer">
                  <div className="order-total">
                    <strong>Total: ${order.totalPrice.toFixed(2)}</strong>
                  </div>
                  <div className="order-actions">
                    <button className="btn-outline">View Details</button>
                    {order.status === "Delivered" && (
                      <button className="btn-primary">Reorder</button>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
