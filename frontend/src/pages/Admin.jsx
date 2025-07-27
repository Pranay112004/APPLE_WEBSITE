import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify"; // ✅ Import toast
import { useApp } from "../context/RealAppContext";
import "./Admin.css"; // We will suggest UI improvements for this below

const Admin = () => {
  const { user, products, getProducts, loading, setLoading } = useApp(); // Assume setLoading is available from context
  const [activeTab, setActiveTab] = useState("products");
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Initial state for the form
  const initialFormState = {
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subCategory: "",
    sizes: [],
    colors: [],
    bestseller: false,
    featured: false,
    specifications: {},
    images: [],
    imageUrls: [""], // For URL-based images
  };

  const [productForm, setProductForm] = useState(initialFormState);

  useEffect(() => {
    // Fetch products only if the user is an admin
    if (user && user.isAdmin) {
      getProducts();
    }
  }, [user, getProducts]); // ✅ Added getProducts to dependency array

  // --- Form Handlers (Unchanged, they were well-written) ---
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setProductForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleArrayInput = (field, value) => {
    const array = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
    setProductForm((prev) => ({ ...prev, [field]: array }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length > 5) {
      toast.error("You can only upload a maximum of 5 images.");
      e.target.value = null; // Clear the selection
      return;
    }
    setProductForm((prev) => ({ ...prev, images: Array.from(e.target.files) }));
  };

  // Handle URL input changes
  const handleImageUrlChange = (index, value) => {
    const newImageUrls = [...productForm.imageUrls];
    newImageUrls[index] = value;
    setProductForm((prev) => ({ ...prev, imageUrls: newImageUrls }));
  };

  // Add new URL input field
  const addImageUrlField = () => {
    if (productForm.imageUrls.length < 5) {
      setProductForm((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, ""]
      }));
    } else {
      toast.error("Maximum 5 image URLs allowed");
    }
  };

  // Remove URL input field
  const removeImageUrlField = (index) => {
    if (productForm.imageUrls.length > 1) {
      const newImageUrls = productForm.imageUrls.filter((_, i) => i !== index);
      setProductForm((prev) => ({ ...prev, imageUrls: newImageUrls }));
    }
  };

  // --- ✅ Corrected and Improved Submit Handler ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Assuming setLoading is from your context

    const formData = new FormData();
    // Append all form fields to FormData
    Object.keys(productForm).forEach((key) => {
      if (key === "images") {
        productForm.images.forEach((imageFile) => {
          formData.append("images", imageFile);
        });
      } else if (
        typeof productForm[key] === "object" &&
        productForm[key] !== null
      ) {
        formData.append(key, JSON.stringify(productForm[key]));
      } else {
        formData.append(key, productForm[key]);
      }
    });

    try {
      const apiUrl = `${
        process.env.REACT_APP_API_URL || "http://localhost:8000/api"
      }/products`;

      const response = await fetch(apiUrl, {
        // ✅ CRITICAL FIX HERE
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          // 'Content-Type' is NOT needed; the browser sets it for FormData
        },
        body: formData,
      });

      const data = await response.json();

      // ✅ Robust error handling
      if (!response.ok) {
        throw new Error(data.message || "Server error. Please try again.");
      }

      toast.success("Product added successfully!"); // ✅ Better UX
      setShowAddProduct(false);
      setProductForm(initialFormState); // Reset form
      getProducts(); // Refresh products list
    } catch (error) {
      console.error("Error adding product:", error);
      toast.error(error.message || "Failed to add product."); // ✅ Better UX
    } finally {
      setLoading(false);
    }
  };

  // --- Access Denied Guard Clause ---
  if (!user || !user.isAdmin) {
    return (
      <div className="admin-page">
        <div className="container">
          <div className="access-denied">
            <h1>Access Denied</h1>
            <p>You need admin privileges to access this page.</p>
          </div>
        </div>
      </div>
    );
  }

  // --- JSX / Render ---
  return (
    <div className="admin-page">
      <div className="container">
        <motion.div
          className="admin-header"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1>Admin Dashboard</h1>
          <p>Manage your Apple Store</p>
        </motion.div>

        {/* ... Tabs remain the same ... */}
        <div className="admin-tabs">
          <button
            className={`tab-btn ${activeTab === "products" ? "active" : ""}`}
            onClick={() => setActiveTab("products")}
          >
            Products ({products.length})
          </button>
          <button
            className={`tab-btn ${activeTab === "orders" ? "active" : ""}`}
            onClick={() => setActiveTab("orders")}
          >
            Orders
          </button>
        </div>

        {activeTab === "products" && (
          <motion.div
            className="products-section"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="section-header">
              <h2>Product Management</h2>
              <button
                className="add-product-btn"
                onClick={() => setShowAddProduct(!showAddProduct)}
              >
                {showAddProduct ? "Cancel" : "＋ Add New Product"}
              </button>
            </div>

            <AnimatePresence>
              {showAddProduct && (
                <motion.div
                  className="add-product-form"
                  initial={{ opacity: 0, height: 0, marginTop: 0 }}
                  animate={{ opacity: 1, height: "auto", marginTop: "2rem" }}
                  exit={{ opacity: 0, height: 0, marginTop: 0 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                >
                  <h3>Add New Product</h3>
                  <form onSubmit={handleSubmit}>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Product Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={productForm.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Category *</label>
                        <select
                          name="category"
                          value={productForm.category}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">Select Category</option>
                          <option value="iPhone">iPhone</option>
                          <option value="iPad">iPad</option>
                          <option value="Mac">Mac</option>
                          <option value="Watch">Watch</option>
                          <option value="AirPods">AirPods</option>
                          <option value="TV & Home">TV & Home</option>
                          <option value="Accessories">Accessories</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Price *</label>
                        <input
                          type="number"
                          name="price"
                          value={productForm.price}
                          onChange={handleInputChange}
                          step="0.01"
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Original Price</label>
                        <input
                          type="number"
                          name="originalPrice"
                          value={productForm.originalPrice}
                          onChange={handleInputChange}
                          step="0.01"
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Sub Category</label>
                      <input
                        type="text"
                        name="subCategory"
                        value={productForm.subCategory}
                        onChange={handleInputChange}
                        placeholder="e.g., iPhone 15 Pro, MacBook Pro"
                      />
                    </div>

                    <div className="form-group">
                      <label>Description *</label>
                      <textarea
                        name="description"
                        value={productForm.description}
                        onChange={handleInputChange}
                        rows="4"
                        required
                      />
                    </div>

                    <div className="form-row">
                      <div className="form-group">
                        <label>Sizes (comma separated)</label>
                        <input
                          type="text"
                          placeholder="S, M, L, XL or 64GB, 128GB, 256GB"
                          onChange={(e) =>
                            handleArrayInput("sizes", e.target.value)
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Colors (comma separated)</label>
                        <input
                          type="text"
                          placeholder="Black, White, Blue, Red"
                          onChange={(e) =>
                            handleArrayInput("colors", e.target.value)
                          }
                        />
                      </div>
                    </div>

                    {/* Enhanced Image Upload Section */}
                    <div className="form-group full-width">
                      <label>Product Images * (Max 5)</label>
                      
                      {/* File Upload Option */}
                      <div className="image-upload-section">
                        <h4>Option 1: Upload from Device</h4>
                        <input
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                          className="file-input"
                        />
                        <small>Upload up to 5 images from your device</small>
                        
                        {productForm.images.length > 0 && (
                          <div className="file-preview">
                            <p>{productForm.images.length} file(s) selected</p>
                            {productForm.images.map((file, index) => (
                              <span key={index} className="file-name">
                                {file.name}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* URL Input Option */}
                      <div className="image-upload-section">
                        <h4>Option 2: Add Image URLs</h4>
                        {productForm.imageUrls.map((url, index) => (
                          <div key={index} className="url-input-row">
                            <input
                              type="url"
                              placeholder="https://example.com/image.jpg"
                              value={url}
                              onChange={(e) => handleImageUrlChange(index, e.target.value)}
                              className="url-input"
                            />
                            {productForm.imageUrls.length > 1 && (
                              <button
                                type="button"
                                onClick={() => removeImageUrlField(index)}
                                className="remove-url-btn"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        
                        {productForm.imageUrls.length < 5 && (
                          <button
                            type="button"
                            onClick={addImageUrlField}
                            className="add-url-btn"
                          >
                            + Add Another URL
                          </button>
                        )}
                        <small>Enter direct image URLs (jpg, png, webp, etc.)</small>
                      </div>

                      {/* Image Preview */}
                      {(productForm.imageUrls.some(url => url.trim()) || productForm.images.length > 0) && (
                        <div className="image-preview-section">
                          <h4>Image Preview</h4>
                          <div className="image-preview-grid">
                            {/* Preview URL images */}
                            {productForm.imageUrls
                              .filter(url => url.trim())
                              .map((url, index) => (
                                <div key={`url-${index}`} className="preview-item">
                                  <img 
                                    src={url} 
                                    alt={`Preview ${index + 1}`}
                                    onError={(e) => {
                                      e.target.style.display = 'none';
                                      e.target.nextSibling.style.display = 'block';
                                    }}
                                  />
                                  <div className="preview-error" style={{display: 'none'}}>
                                    Invalid URL
                                  </div>
                                </div>
                              ))
                            }
                            
                            {/* Preview file images */}
                            {productForm.images.map((file, index) => (
                              <div key={`file-${index}`} className="preview-item">
                                <img 
                                  src={URL.createObjectURL(file)} 
                                  alt={`File ${index + 1}`}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="form-row checkbox-row">
                      <div className="checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            name="bestseller"
                            checked={productForm.bestseller}
                            onChange={handleInputChange}
                          />
                          <span>Bestseller</span>
                        </label>
                      </div>
                      <div className="checkbox-group">
                        <label>
                          <input
                            type="checkbox"
                            name="featured"
                            checked={productForm.featured}
                            onChange={handleInputChange}
                          />
                          <span>Featured</span>
                        </label>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="submit-btn"
                      disabled={loading}
                    >
                      {loading ? "Adding..." : "Add Product"}
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="products-grid">
              {loading ? (
                <div className="loading">Loading products...</div>
              ) : products.length > 0 ? (
                products.map((product) => (
                  <div key={product._id} className="product-card-admin">
                    <div className="product-image">
                      {product.images && product.images.length > 0 ? (
                        <img src={product.images[0]} alt={product.name} />
                      ) : (
                        <div className="no-image">No Image</div>
                      )}
                    </div>
                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p className="category">{product.category}</p>
                      <p className="price">${product.price}</p>
                      <div className="badges">
                        {product.bestseller && (
                          <span className="badge bestseller">Bestseller</span>
                        )}
                        {product.featured && (
                          <span className="badge featured">Featured</span>
                        )}
                      </div>
                      <div className="product-actions">
                        <button className="edit-btn">Edit</button>
                        <button className="delete-btn">Delete</button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-products">
                  <p>No products found. Add your first product!</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ... Orders tab remains the same ... */}
      </div>
    </div>
  );
};

export default Admin;
