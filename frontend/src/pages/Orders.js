import React, { useState, useEffect } from 'react';
import { useApp } from '../context/RealAppContext';
import './Orders.css';

const Orders = () => {
  const { orders, getOrders, cancelOrder, editOrder, loading } = useApp();
  const [editingOrder, setEditingOrder] = useState(null);
  const [editData, setEditData] = useState({});

  useEffect(() => {
    getOrders();
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      await cancelOrder(orderId);
    }
  };

  const handleEditOrder = (order) => {
    setEditingOrder(order._id);
    setEditData({
      shippingAddress: order.shippingAddress
    });
  };

  const handleSaveEdit = async (orderId) => {
    const result = await editOrder(orderId, editData);
    if (result.success) {
      setEditingOrder(null);
      setEditData({});
    }
  };

  const handleCancelEdit = () => {
    setEditingOrder(null);
    setEditData({});
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return '#ff9500';
      case 'Processing':
        return '#007aff';
      case 'Shipped':
        return '#34c759';
      case 'Delivered':
        return '#30d158';
      case 'Cancelled':
        return '#ff3b30';
      default:
        return '#8e8e93';
    }
  };

  const canCancelOrder = (status) => {
    return ['Pending', 'Processing'].includes(status);
  };

  const canEditOrder = (status) => {
    return ['Pending'].includes(status);
  };

  if (loading) {
    return (
      <div className="orders-loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h1>My Orders</h1>
        <p>Track and manage your orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="no-orders">
          <div className="no-orders-icon">📦</div>
          <h2>No orders yet</h2>
          <p>When you place your first order, it will appear here.</p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              <div className="order-header">
                <div className="order-info">
                  <h3>Order #{order._id.slice(-8)}</h3>
                  <p className="order-date">
                    {new Date(order.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
                <div 
                  className="order-status"
                  style={{ backgroundColor: getStatusColor(order.status) }}
                >
                  {order.status}
                </div>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img 
                      src={item.productId?.image || '/placeholder-image.jpg'} 
                      alt={item.productId?.name}
                      className="item-image"
                    />
                    <div className="item-details">
                      <h4>{item.productId?.name}</h4>
                      <p className="item-specs">
                        {item.size && `Size: ${item.size}`}
                        {item.color && ` • Color: ${item.color}`}
                        {` • Qty: ${item.quantity}`}
                      </p>
                      <p className="item-price">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-details">
                <div className="shipping-address">
                  <h4>Shipping Address</h4>
                  {editingOrder === order._id ? (
                    <div className="edit-address">
                      <textarea
                        value={editData.shippingAddress || ''}
                        onChange={(e) => setEditData({
                          ...editData,
                          shippingAddress: e.target.value
                        })}
                        rows="3"
                        className="address-input"
                      />
                      <div className="edit-actions">
                        <button 
                          onClick={() => handleSaveEdit(order._id)}
                          className="save-btn"
                        >
                          Save Changes
                        </button>
                        <button 
                          onClick={handleCancelEdit}
                          className="cancel-edit-btn"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p>{order.shippingAddress}</p>
                  )}
                </div>
                
                <div className="order-total">
                  <h4>Total: ₹{order.totalAmount}</h4>
                </div>
              </div>

              <div className="order-actions">
                {canEditOrder(order.status) && editingOrder !== order._id && (
                  <button 
                    onClick={() => handleEditOrder(order)}
                    className="edit-btn"
                  >
                    Edit Shipping Address
                  </button>
                )}
                
                {canCancelOrder(order.status) && (
                  <button 
                    onClick={() => handleCancelOrder(order._id)}
                    className="cancel-btn"
                  >
                    Cancel Order
                  </button>
                )}
                
                <button className="track-btn">
                  Track Order
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;
