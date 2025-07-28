const express = require("express");
const Product = require("../models/Product");
const { protect, admin } = require("../middleware/authMiddleware");
const {
  upload,
  uploadToCloudinary,
} = require("../middleware/uploadMiddleware");

const router = express.Router();

// Get all products
router.get("/", async (req, res) => {
  try {
    const { category, subCategory, search, sort } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }
    if (subCategory) {
      query.subCategory = subCategory;
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    let products = await Product.find(query);

    // Sorting
    if (sort === "price-low-high") {
      products = products.sort((a, b) => a.price - b.price);
    } else if (sort === "price-high-low") {
      products = products.sort((a, b) => b.price - a.price);
    }

    res.json({
      success: true,
      products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    res.json({
      success: true,
      product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Create product (Admin only)
router.post(
  "/",
  protect,
  admin,
  upload.array("images", 5),
  async (req, res) => {
    try {
      console.log("Creating product - Request body:", req.body);
      console.log("Files received:", req.files?.length || 0);
      
      const {
        name,
        description,
        price,
        originalPrice,
        category,
        subCategory,
        sizes,
        colors,
        bestseller,
        featured,
        specifications,
        imageUrls, // Add imageUrls from form data
      } = req.body;

      // Validation
      if (!name || !description || !price || !category) {
        return res.status(400).json({
          success: false,
          message: "Name, description, price, and category are required",
        });
      }

      // Parse imageUrls if it exists and is a string (from FormData)
      let urlsFromForm = [];
      if (imageUrls) {
        try {
          urlsFromForm = JSON.parse(imageUrls).filter(url => url && url.trim());
        } catch (e) {
          // If not JSON, treat as single URL
          if (typeof imageUrls === 'string' && imageUrls.trim()) {
            urlsFromForm = [imageUrls.trim()];
          }
        }
      }

      // Check if we have either files or URLs
      const hasFiles = req.files && req.files.length > 0;
      const hasUrls = urlsFromForm.length > 0;
      
      if (!hasFiles && !hasUrls) {
        return res.status(400).json({
          success: false,
          message: "At least one image (file upload or URL) is required",
        });
      }

      // Process images: Upload files to Cloudinary and include URLs
      const finalImageUrls = [];
      
      // Upload files to Cloudinary
      if (hasFiles) {
        for (const file of req.files) {
          try {
            const result = await uploadToCloudinary(file.buffer);
            finalImageUrls.push(result.secure_url);
          } catch (uploadError) {
            console.error("Image upload error:", uploadError);
            return res.status(500).json({
              success: false,
              message: "Failed to upload images",
            });
          }
        }
      }
      
      // Add URL-based images
      if (hasUrls) {
        finalImageUrls.push(...urlsFromForm);
      }

      const product = new Product({
        name,
        description,
        price: Number(price),
        originalPrice: originalPrice ? Number(originalPrice) : undefined,
        category,
        subCategory,
        images: finalImageUrls,
        sizes: sizes ? JSON.parse(sizes) : [],
        colors: colors ? JSON.parse(colors) : [],
        bestseller: bestseller === "true",
        featured: featured === "true",
        specifications: specifications ? JSON.parse(specifications) : {},
      });

      const savedProduct = await product.save();
      console.log("Product created successfully:", savedProduct._id);
      
      res.status(201).json({
        success: true,
        product: savedProduct,
      });
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
);

// Update product (Admin only)
router.put("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      success: true,
      product: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Delete product (Admin only)
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    await Product.findByIdAndDelete(req.params.id);
    res.json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
