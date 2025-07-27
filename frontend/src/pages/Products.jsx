import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, Filter } from "lucide-react";
import { motion } from "framer-motion";
import ProductCard from "../components/ProductCard";
import { useApp } from "../context/RealAppContext";
import "./Products.css";

const Products = () => {
  const { products, getProducts, loading } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();

  const [filters, setFilters] = useState({
    category: searchParams.get("category") || "",
    search: searchParams.get("search") || "",
    sort: searchParams.get("sort") || "",
    priceRange: searchParams.get("priceRange") || "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Sync filters with URL params when route changes
  useEffect(() => {
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const sort = searchParams.get("sort") || "";
    const priceRange = searchParams.get("priceRange") || "";
    
    setFilters({
      category,
      search,
      sort,
      priceRange,
    });
  }, [searchParams]);

  useEffect(() => {
    getProducts(filters);
  }, [filters, getProducts]); // ✅ Include getProducts dependency

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);

    // Update URL params
    const newSearchParams = new URLSearchParams();
    Object.entries(newFilters).forEach(([k, v]) => {
      if (v) newSearchParams.set(k, v);
    });
    setSearchParams(newSearchParams);
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      search: "",
      sort: "",
      priceRange: "",
    });
    setSearchParams({});
  };

  const categories = [
    "iPhone",
    "iPad",
    "Mac",
    "Watch",
    "AirPods",
    "TV & Home",
    "Accessories",
  ];
  const sortOptions = [
    { value: "", label: "Featured" },
    { value: "price-low-high", label: "Price: Low to High" },
    { value: "price-high-low", label: "Price: High to Low" },
    { value: "name-a-z", label: "Name: A to Z" },
  ];

  return (
    <div className="products-page">
      <div className="container">
        {/* Header */}
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>{filters.category ? `${filters.category}` : "All Products"}</h1>
          <p>{products.length} products found</p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          className="products-controls"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="search-box">
            <Search size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          <button
            className="filter-toggle"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={20} />
            Filters
          </button>
        </motion.div>

        {/* Filters Panel */}
        {showFilters && (
          <motion.div
            className="filters-panel"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="filter-group">
              <h4>Category</h4>
              <div className="filter-options">
                <button
                  className={!filters.category ? "active" : ""}
                  onClick={() => handleFilterChange("category", "")}
                >
                  All
                </button>
                {categories.map((category) => (
                  <button
                    key={category}
                    className={filters.category === category ? "active" : ""}
                    onClick={() => handleFilterChange("category", category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            <div className="filter-group">
              <h4>Sort By</h4>
              <select
                value={filters.sort}
                onChange={(e) => handleFilterChange("sort", e.target.value)}
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <button className="clear-filters" onClick={clearFilters}>
              Clear All Filters
            </button>
          </motion.div>
        )}

        {/* Products Grid */}
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner">Loading...</div>
          </div>
        ) : (
          <motion.div
            className="products-grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {products.length > 0 ? (
              products.map((product, index) => (
                <motion.div
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <ProductCard product={product} />
                </motion.div>
              ))
            ) : (
              <div className="no-products">
                <h3>No products found</h3>
                <p>Try adjusting your filters or search terms.</p>
                <button onClick={clearFilters} className="btn-primary">
                  Clear Filters
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Products;
