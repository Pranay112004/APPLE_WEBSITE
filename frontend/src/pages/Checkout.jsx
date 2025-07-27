import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context/RealAppContext";
import { toast } from "react-toastify";
import "./Checkout.css";

const Checkout = () => {
  const { cart, user, createOrder } = useApp();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("stripe");
  const [shippingAddress, setShippingAddress] = useState({
    fullName: user?.name || "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  const handleAddressChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate form
      const requiredFields = [
        "fullName",
        "address",
        "city",
        "postalCode",
        "country",
        "phone",
      ];
      const missingFields = requiredFields.filter(
        (field) => !shippingAddress[field]
      );

      if (missingFields.length > 0) {
        toast.error("Please fill in all required fields");
        setLoading(false);
        return;
      }

      // Create order data
      const orderData = {
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          image: item.product.images[0],
          price: item.price,
          quantity: item.quantity,
          size: item.size,
          color: item.color,
        })),
        shippingAddress,
        paymentMethod,
        itemsPrice: cart.totalAmount,
        taxPrice: cart.totalAmount * 0.08,
        shippingPrice: 0,
        totalPrice: cart.totalAmount * 1.08,
      };

      // Create order
      const order = await createOrder(orderData);

      // Redirect to confirmation page
      navigate(`/order-confirmation/${order._id}`);
    } catch (error) {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <div className="checkout-page">
        <div className="container">
          <div className="empty-cart">
            <h2>Your cart is empty</h2>
            <p>Add some items to your cart before checking out.</p>
            <button
              className="btn-primary"
              onClick={() => navigate("/products")}
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="container">
        <h1>Checkout</h1>

        <div className="checkout-layout">
          <div className="checkout-form">
            <form onSubmit={handleSubmit}>
              {/* Shipping Address */}
              <div className="form-section">
                <h3>Shipping Address</h3>
                <div className="form-grid">
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Full Name *"
                    value={shippingAddress.fullName}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="address"
                    placeholder="Address *"
                    value={shippingAddress.address}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={shippingAddress.city}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code *"
                    value={shippingAddress.postalCode}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="text"
                    name="country"
                    placeholder="Country *"
                    value={shippingAddress.country}
                    onChange={handleAddressChange}
                    required
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={shippingAddress.phone}
                    onChange={handleAddressChange}
                    required
                  />
                </div>
              </div>

              {/* Payment Method */}
              <div className="form-section">
                <h3>Payment Method</h3>
                <div className="payment-methods">
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="stripe"
                      checked={paymentMethod === "stripe"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💳 Credit/Debit Card</span>
                  </label>
                  <label className="payment-option">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={paymentMethod === "cod"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span>💵 Cash on Delivery</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="place-order-btn"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : `Place Order - $${(cart.totalAmount * 1.08).toFixed(2)}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="order-summary">
            <h3>Order Summary</h3>
            <div className="order-items">
              {cart.items.map((item) => (
                <div key={item._id} className="order-item">
                  <img src={item.product.images[0]} alt={item.product.name} />
                  <div>
                    <h4>{item.product.name}</h4>
                    <p>Qty: {item.quantity}</p>
                    {item.size && <p>Size: {item.size}</p>}
                    {item.color && <p>Color: {item.color}</p>}
                  </div>
                  <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="order-totals">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${cart.totalAmount.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Tax:</span>
                <span>${(cart.totalAmount * 0.08).toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="total-row final-total">
                <span>Total:</span>
                <span>${(cart.totalAmount * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
