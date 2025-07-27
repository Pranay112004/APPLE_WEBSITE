const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    originalPrice: {
      type: Number,
    },
    category: {
      type: String,
      required: true,
      enum: [
        "iPhone",
        "iPad",
        "Mac",
        "Watch",
        "AirPods",
        "TV & Home",
        "Accessories",
      ],
    },
    subCategory: {
      type: String,
    },
    images: [
      {
        type: String,
        required: true,
      },
    ],
    sizes: [
      {
        type: String,
      },
    ],
    colors: [
      {
        type: String,
      },
    ],
    bestseller: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    specifications: {
      type: Map,
      of: String,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);
