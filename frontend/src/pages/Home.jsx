import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/RealAppContext";
import "./Home.css";

const Home = () => {
  const { products, getProducts } = useApp();
  const [currentHeroIndex, setCurrentHeroIndex] = useState(0);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);

  const heroSlides = [
    {
      title: "iPhone 16 Pro",
      subtitle: "Titanium. So strong. So light. So Pro.",
      image:
        "https://www.apple.com/v/iphone-16-pro/f/images/overview/contrast/iphone_16_pro__erqf8e51gl4y_xlarge_2x.jpg",
      link: "/products?category=iPhone",
      color: "#1d1d1f",
    },
    {
      title: "MacBook Pro",
      subtitle: "Mind-blowing. Head-turning.",
      image:
        "https://store.storeimages.cdn-apple.com/1/as-images.apple.com/is/mbp16-spaceblack-select-202410?wid=904&hei=840&fmt=jpeg&qlt=90&.v=Nys1UFFBTmI1T0VnWWNyeEZhdDFYamhTSEZFNjlmT2xUUDNBTjljV1BxWVk4UDMvOWNCVUEyZk1VN2FtQlpZWXZvdUZlR0V0VUdJSjBWaDVNVG95YlBROXI4TlIyY1pzUUZwNVlXcEFNb2c",
      link: "/products?category=Mac",
      color: "#1d1d1f",
    },
    {
      title: "Apple Watch Ultra",
      subtitle: "Adventure awaits.",
      image:
        "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800&q=80",
      link: "/products?category=Watch",
      color: "#000000",
    },
  ];

  // Auto-rotate hero slides
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentHeroIndex((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroSlides.length]);

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
      {/* Modern Hero Section */}
      <section
        className="modern-hero"
        style={{ backgroundColor: heroSlides[currentHeroIndex].color }}
      >
        <div className="hero-container">
          <motion.div className="hero-content" style={{ y: y1 }}>
            <motion.div
              className="hero-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              New
            </motion.div>

            <motion.h1
              className="hero-title"
              key={currentHeroIndex}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 1, ease: "easeOut" }}
            >
              {heroSlides[currentHeroIndex].title}
            </motion.h1>

            <motion.p
              className="hero-subtitle"
              key={`subtitle-${currentHeroIndex}`}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            >
              {heroSlides[currentHeroIndex].subtitle}
            </motion.p>

            <motion.div
              className="hero-actions"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <Link
                to={heroSlides[currentHeroIndex].link}
                className="btn-primary"
              >
                Buy now
                <span className="btn-icon">→</span>
              </Link>
              <Link
                to={heroSlides[currentHeroIndex].link}
                className="btn-secondary"
              >
                Learn more
                <span className="btn-icon">+</span>
              </Link>
            </motion.div>
          </motion.div>

          <motion.div className="hero-image" style={{ y: y2 }}>
            <motion.img
              key={currentHeroIndex}
              src={heroSlides[currentHeroIndex].image}
              alt={heroSlides[currentHeroIndex].title}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 1.2, ease: "easeOut" }}
            />
          </motion.div>
        </div>

        {/* Hero Indicators */}
        <div className="hero-indicators">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              className={`indicator ${
                currentHeroIndex === index ? "active" : ""
              }`}
              onClick={() => setCurrentHeroIndex(index)}
            />
          ))}
        </div>
      </section>

      {/* Announcement Banner */}
      <section className="announcement-banner">
        <div className="container">
          <motion.div
            className="announcement-content"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <span className="announcement-icon">📱</span>
            <p>
              Get up to $800 in credit when you trade in iPhone 12 or higher.
            </p>
            <Link to="/products" className="announcement-link">
              Shop now →
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="featured-section">
          <div className="container">
            <div className="section-header">
              <motion.div
                className="section-badge"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
              >
                ✨ Handpicked
              </motion.div>
              <motion.h2
                className="section-title"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                Featured Products
              </motion.h2>
              <motion.p
                className="section-subtitle"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
              >
                Discover our most innovative and popular products
              </motion.p>
            </div>
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
