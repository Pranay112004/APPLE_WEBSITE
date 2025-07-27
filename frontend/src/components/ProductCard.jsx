import React from "react";

import { Link } from "react-router-dom";

import { useApp } from "../context/RealAppContext";

import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const { addToCart } = useApp();

  const handleAddToCart = (e) => {
    e.preventDefault();

    e.stopPropagation();

    addToCart(product._id);
  };

  return (
    <div className="product-card">
      <Link to={`/product/${product._id}`} className="product-link">
        <div className="product-image">
          <img src={product.images[0]} alt={product.name} loading="lazy" />

          {product.bestseller && (
            <span className="bestseller-badge">Bestseller</span>
          )}
        </div>

        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>

          <p className="product-description">{product.description}</p>

          <div className="product-pricing">
            <span className="current-price">${product.price}</span>

            {product.originalPrice && product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice}</span>
            )}
          </div>

          <div className="product-actions">
            <button className="add-to-cart-btn" onClick={handleAddToCart}>
              Add to Cart
            </button>

            <span className="learn-more">Learn more </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
