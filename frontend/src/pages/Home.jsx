import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/RealAppContext"; // ✅ Backend API integration
import "./Home.css";

const Home = () => {
  const { products, getProducts } = useApp();
  const canvasRef = useRef(null);

  // Three.js particle system (simplified version)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 100;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        radius: Math.random() * 3 + 1,
        opacity: Math.random() * 0.8 + 0.2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((particle) => {
        particle.x += particle.vx;
        particle.y += particle.vy;

        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${particle.opacity})`;
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getProducts();
  }, []); // ✅ Fixed dependency array to avoid warning

  const featuredProducts = products
    .filter((product) => product.featured)
    .slice(0, 6);
  const bestsellerProducts = products
    .filter((product) => product.bestseller)
    .slice(0, 8);

  return (
    <div className="home">
      {/* Particle Background */}
      <canvas ref={canvasRef} className="particle-canvas" />

      {/* Hero Section */}
      <section className="hero">
        <motion.div
          className="hero-content"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            className="hero-title"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            iPhone 15 Pro
          </motion.h1>
          <motion.p
            className="hero-subtitle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Titanium. So strong. So light. So Pro.
          </motion.p>
          <motion.div
            className="hero-actions"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <Link to="/products?category=iPhone" className="btn-primary">
              Shop iPhone
            </Link>
            <Link to="/product/1" className="btn-secondary">
              Learn more
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Featured Products
            </motion.h2>
            <div className="products-grid">
              {featuredProducts.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Product Categories */}
      <section className="categories-section">
        <div className="container">
          <motion.h2
            className="section-title"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            Explore the lineup
          </motion.h2>
          <div className="categories-grid">
            {[
              {
                name: "Mac",
                image:
                  "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
                link: "/products?category=Mac",
              },
              {
                name: "iPad",
                image:
                  "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
                link: "/products?category=iPad",
              },
              {
                name: "iPhone",
                image:
                  "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
                link: "/products?category=iPhone",
              },
              {
                name: "Watch",
                image:
                  "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
                link: "/products?category=Watch",
              },
              {
                name: "AirPods",
                image:
                  "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
                link: "/products?category=AirPods",
              },
              {
                name: "TV & Home",
                image:
                  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
                link: "/products?category=TV & Home",
              },
            ].map((category, index) => (
              <motion.div
                key={category.name}
                className="category-card"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={category.link}>
                  <div className="category-image">
                    <img src={category.image} alt={category.name} />
                  </div>
                  <h3>{category.name}</h3>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Bestsellers */}
      {bestsellerProducts.length > 0 && (
        <section className="bestsellers-section">
          <div className="container">
            <motion.h2
              className="section-title"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              Bestsellers
            </motion.h2>
            <div className="infinity-scroll">
              <div className="infinity-container">
                {[...bestsellerProducts, ...bestsellerProducts].map(
                  (product, index) => (
                    <div
                      key={`${product._id}-${index}`}
                      className="infinity-item"
                    >
                      <ProductCard product={product} />
                    </div>
                  )
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Apple Values */}
      <section className="values-section">
        <div className="container">
          <div className="values-grid">
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <div className="value-icon">🔒</div>
              <h3>Privacy</h3>
              <p>
                Your data belongs to you. Apple products are designed to protect
                your privacy.
              </p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div className="value-icon">🌱</div>
              <h3>Environment</h3>
              <p>
                We're committed to carbon neutrality across our entire business
                by 2030.
              </p>
            </motion.div>
            <motion.div
              className="value-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div className="value-icon">♿</div>
              <h3>Accessibility</h3>
              <p>
                Technology should be accessible to everyone. Accessibility is a
                core value at Apple.
              </p>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
