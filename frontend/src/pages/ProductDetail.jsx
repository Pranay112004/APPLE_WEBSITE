import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Heart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useApp } from "../context/RealAppContext";
import { toast } from "react-toastify";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, addToCart } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      const productData = await getProduct(id);
      if (productData) {
        setProduct(productData);
        setSelectedSize(productData.sizes?.[0] || "");
        setSelectedColor(productData.colors?.[0] || "");
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id, getProduct]);

  const handleAddToCart = () => {
    if (product.sizes && product.sizes.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors && product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }

    addToCart(product._id, quantity, selectedSize, selectedColor);
  };

  if (loading) {
    return (
      <div className="product-detail-loading">
        <div className="loading-spinner">Loading product...</div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products")} className="btn-primary">
          Back to Products
        </button>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="container">
        {/* Back Button */}
        <motion.button
          className="back-button"
          onClick={() => navigate(-1)}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <ArrowLeft size={20} />
          Back
        </motion.button>

        <div className="product-layout">
          {/* Product Images */}
          <motion.div
            className="product-images"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="main-image">
              <img src={product.images[selectedImage]} alt={product.name} />
              {product.bestseller && (
                <span className="bestseller-badge">Bestseller</span>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="image-thumbnails">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    className={`thumbnail ${
                      selectedImage === index ? "active" : ""
                    }`}
                    onClick={() => setSelectedImage(index)}
                  >
                    <img src={image} alt={`${product.name} ${index + 1}`} />
                  </button>
                ))}
              </div>
            )}
          </motion.div>

          {/* Product Info */}
          <motion.div
            className="product-info"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="product-header">
              <h1>{product.name}</h1>
              <div className="product-actions">
                <button className="action-btn">
                  <Heart size={20} />
                </button>
                <button className="action-btn">
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <p className="product-description">{product.description}</p>

            <div className="product-pricing">
              <span className="current-price">${product.price}</span>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <span className="original-price">
                    ${product.originalPrice}
                  </span>
                )}
            </div>

            {/* Size Selection */}
            {product.sizes && product.sizes.length > 0 && (
              <div className="product-options">
                <h4>Size</h4>
                <div className="option-buttons">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      className={`option-btn ${
                        selectedSize === size ? "active" : ""
                      }`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {product.colors && product.colors.length > 0 && (
              <div className="product-options">
                <h4>Color</h4>
                <div className="option-buttons">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      className={`option-btn ${
                        selectedColor === color ? "active" : ""
                      }`}
                      onClick={() => setSelectedColor(color)}
                    >
                      {color}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="quantity-section">
              <h4>Quantity</h4>
              <div className="quantity-controls">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="quantity-btn"
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="quantity-btn"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="purchase-section">
              <button className="add-to-cart-btn" onClick={handleAddToCart}>
                Add to Cart - ${(product.price * quantity).toFixed(2)}
              </button>
              <button className="buy-now-btn">Buy Now</button>
            </div>

            {/* Features */}
            <div className="product-features">
              <div className="feature">
                <Truck size={20} />
                <span>Free delivery</span>
              </div>
              <div className="feature">
                <Shield size={20} />
                <span>2-year warranty</span>
              </div>
              <div className="feature">
                <RotateCcw size={20} />
                <span>30-day returns</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Specifications */}
        {product.specifications &&
          Object.keys(product.specifications).length > 0 && (
            <motion.div
              className="specifications"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              <h3>Specifications</h3>
              <div className="specs-grid">
                {Object.entries(product.specifications).map(([key, value]) => (
                  <div key={key} className="spec-item">
                    <strong>{key}:</strong>
                    <span>{value}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
      </div>
    </div>
  );
};

export default ProductDetail;
