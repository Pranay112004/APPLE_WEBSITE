import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found-page">
      <div className="container">
        <motion.div
          className="not-found-content"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="error-code">404</div>
          <h1>Page Not Found</h1>
          <p>
            Sorry, we couldn't find the page you're looking for. It might have
            been moved, deleted, or the URL might be incorrect.
          </p>

          <div className="error-actions">
            <Link to="/" className="btn-primary">
              <Home size={20} />
              Go Home
            </Link>
            <Link to="/products" className="btn-secondary">
              <Search size={20} />
              Browse Products
            </Link>
            <button
              onClick={() => window.history.back()}
              className="btn-outline"
            >
              <ArrowLeft size={20} />
              Go Back
            </button>
          </div>

          <div className="helpful-links">
            <h3>Popular Pages</h3>
            <ul>
              <li>
                <Link to="/products?category=iPhone">iPhone</Link>
              </li>
              <li>
                <Link to="/products?category=Mac">Mac</Link>
              </li>
              <li>
                <Link to="/products?category=iPad">iPad</Link>
              </li>
              <li>
                <Link to="/products?category=Watch">Apple Watch</Link>
              </li>
              <li>
                <Link to="/products?category=AirPods">AirPods</Link>
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
