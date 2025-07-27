const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Product = require("./models/Product");

dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected for seeding");
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

const createAdminUser = async () => {
  try {
    // Check if admin already exists
    const adminExists = await User.findOne({ email: "admin@apple.com" });
    if (adminExists) {
      console.log("Admin user already exists");
      return;
    }

    // Create admin user
    const admin = new User({
      name: "Admin User",
      email: "admin@apple.com",
      password: "admin123",
      isAdmin: true,
      phone: "1234567890",
    });

    await admin.save();
    console.log("Admin user created successfully");
    console.log("Email: admin@apple.com");
    console.log("Password: admin123");
  } catch (error) {
    console.error("Error creating admin user:", error.message);
  }
};

const createSampleProducts = async () => {
  try {
    // Check if products already exist
    const productCount = await Product.countDocuments();
    if (productCount > 0) {
      console.log("Products already exist in database");
      return;
    }

    const sampleProducts = [
      {
        name: "iPhone 15 Pro",
        description: "The most advanced iPhone ever with titanium design and A17 Pro chip.",
        price: 999,
        originalPrice: 1099,
        category: "iPhone",
        subCategory: "Pro",
        images: [
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/iphone-15-pro-finish-select-202309-6-1inch-naturaltitanium?wid=5120&hei=2880&fmt=p-jpg&qlt=80&.v=1692845702654"
        ],
        sizes: ["128GB", "256GB", "512GB", "1TB"],
        colors: ["Natural Titanium", "Blue Titanium", "White Titanium", "Black Titanium"],
        bestseller: true,
        featured: true,
        specifications: {
          "Display": "6.1-inch Super Retina XDR",
          "Chip": "A17 Pro",
          "Camera": "48MP Main camera",
          "Battery": "Up to 23 hours video playback"
        }
      },
      {
        name: "MacBook Air M3",
        description: "Supercharged by the M3 chip, MacBook Air is up to 60% faster than the previous generation.",
        price: 1099,
        originalPrice: 1199,
        category: "Mac",
        subCategory: "Air",
        images: [
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/macbook-air-midnight-select-20220606?wid=904&hei=840&fmt=jpeg&qlt=90&.v=1653084303665"
        ],
        sizes: ["256GB", "512GB", "1TB", "2TB"],
        colors: ["Midnight", "Starlight", "Silver", "Space Gray"],
        bestseller: true,
        featured: false,
        specifications: {
          "Display": "13.6-inch Liquid Retina",
          "Chip": "Apple M3",
          "Memory": "8GB unified memory",
          "Storage": "Starting at 256GB SSD"
        }
      },
      {
        name: "iPad Pro",
        description: "The ultimate iPad experience with M4 chip and stunning Liquid Retina XDR display.",
        price: 799,
        originalPrice: 899,
        category: "iPad",
        subCategory: "Pro",
        images: [
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/ipad-pro-12-select-wifi-spacegray-202210?wid=940&hei=1112&fmt=p-jpg&qlt=95&.v=1664411207213"
        ],
        sizes: ["128GB", "256GB", "512GB", "1TB", "2TB"],
        colors: ["Space Gray", "Silver"],
        bestseller: false,
        featured: true,
        specifications: {
          "Display": "12.9-inch Liquid Retina XDR",
          "Chip": "Apple M4",
          "Camera": "12MP Wide, 10MP Ultra Wide",
          "Battery": "Up to 10 hours"
        }
      },
      {
        name: "Apple Watch Series 9",
        description: "The most advanced Apple Watch yet with the S9 chip and Double Tap gesture.",
        price: 399,
        originalPrice: 449,
        category: "Watch",
        subCategory: "Series 9",
        images: [
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/watch-s9-aluminum-pink-nc-45-front-9to1_FMT_WHH?wid=906&hei=1015&fmt=p-jpg&qlt=95&.v=1692737930654"
        ],
        sizes: ["41mm", "45mm"],
        colors: ["Pink", "Midnight", "Starlight", "Silver", "Red"],
        bestseller: true,
        featured: false,
        specifications: {
          "Display": "Always-On Retina LTPO OLED",
          "Chip": "S9 SiP",
          "Battery": "Up to 18 hours",
          "Health": "Blood Oxygen, ECG, Sleep tracking"
        }
      },
      {
        name: "AirPods Pro (2nd generation)",
        description: "Adaptive Transparency, Personalized Spatial Audio, and up to 2x more Active Noise Cancellation.",
        price: 249,
        originalPrice: 279,
        category: "AirPods",
        subCategory: "Pro",
        images: [
          "https://store.storeimages.cdn-apple.com/4982/as-images.apple.com/is/MQD83?wid=1144&hei=1144&fmt=jpeg&qlt=90&.v=1660803972361"
        ],
        sizes: [],
        colors: ["White"],
        bestseller: true,
        featured: true,
        specifications: {
          "Chip": "H2 chip",
          "Battery": "Up to 6 hours listening time",
          "Case Battery": "Up to 30 hours total",
          "Features": "Active Noise Cancellation, Transparency mode"
        }
      }
    ];

    await Product.insertMany(sampleProducts);
    console.log("Sample products created successfully");
  } catch (error) {
    console.error("Error creating sample products:", error.message);
  }
};

const seedDatabase = async () => {
  await connectDB();
  await createAdminUser();
  await createSampleProducts();
  console.log("Database seeding completed");
  process.exit(0);
};

seedDatabase();
