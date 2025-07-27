const mongoose = require("mongoose");
const dotenv = require("dotenv");
const Product = require("./models/Product");
const User = require("./models/User");

dotenv.config();

const products = [
  {
    name: "iPhone 15 Pro",
    description: "Titanium. So strong. So light. So Pro.",
    price: 999,
    originalPrice: 1099,
    category: "iPhone",
    images: [
      "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
      "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    ],
    sizes: ["128GB", "256GB", "512GB", "1TB"],
    colors: [
      "Natural Titanium",
      "Blue Titanium",
      "White Titanium",
      "Black Titanium",
    ],
    bestseller: true,
    featured: true,
    inStock: true,
    specifications: {
      Display: "6.1-inch Super Retina XDR",
      Chip: "A17 Pro chip",
      Camera: "Pro camera system",
      Battery: "Up to 23 hours video playback",
    },
  },
  {
    name: 'MacBook Pro 14"',
    description: "Supercharged by M3, M3 Pro, and M3 Max chips.",
    price: 1599,
    originalPrice: 1799,
    category: "Mac",
    images: [
      "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400",
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca4?w=400",
    ],
    sizes: ["512GB", "1TB", "2TB"],
    colors: ["Space Gray", "Silver"],
    bestseller: true,
    featured: true,
    inStock: true,
    specifications: {
      Display: "14.2-inch Liquid Retina XDR",
      Chip: "Apple M3 chip",
      Memory: "8GB unified memory",
      Storage: "512GB SSD",
    },
  },
  {
    name: "iPad Air",
    description: "Light. Bright. Full of might.",
    price: 599,
    category: "iPad",
    images: [
      "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
      "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=400",
    ],
    sizes: ["64GB", "256GB"],
    colors: ["Space Gray", "Starlight", "Pink", "Purple", "Blue"],
    bestseller: false,
    featured: true,
    inStock: true,
    specifications: {
      Display: "10.9-inch Liquid Retina",
      Chip: "Apple M1 chip",
      Camera: "Wide camera",
      Battery: "Up to 10 hours",
    },
  },
  {
    name: "Apple Watch Series 9",
    description: "Smarter. Brighter. Mightier.",
    price: 399,
    category: "Watch",
    images: [
      "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400",
      "https://images.unsplash.com/photo-1510017098667-27dfc7150479?w=400",
    ],
    sizes: ["41mm", "45mm"],
    colors: ["Midnight", "Starlight", "Silver", "Product Red"],
    bestseller: true,
    featured: false,
    inStock: true,
    specifications: {
      Display: "Always-On Retina display",
      Chip: "S9 SiP",
      Health: "ECG app, Blood Oxygen app",
      Battery: "Up to 18 hours",
    },
  },
  {
    name: "AirPods Pro (2nd generation)",
    description: "Adaptive Audio. Now playing.",
    price: 249,
    category: "AirPods",
    images: [
      "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
      "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400",
    ],
    colors: ["White"],
    bestseller: true,
    featured: true,
    inStock: true,
    specifications: {
      Audio: "Adaptive Audio",
      "Noise Control": "Active Noise Cancellation",
      Battery: "Up to 6 hours listening time",
      Case: "MagSafe Charging Case",
    },
  },
  {
    name: "Mac Studio",
    description: "Supercharged by M2 Max and M2 Ultra.",
    price: 1999,
    category: "Mac",
    images: [
      "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400",
      "https://images.unsplash.com/photo-1484788984921-03950022c9ef?w=400",
    ],
    sizes: ["M2 Max", "M2 Ultra"],
    colors: ["Silver"],
    bestseller: false,
    featured: true,
    inStock: true,
    specifications: {
      Chip: "Apple M2 Max or M2 Ultra",
      Memory: "Up to 192GB unified memory",
      Storage: "Up to 8TB SSD",
      Ports: "Thunderbolt 4, USB-A, HDMI",
    },
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@apple.com",
    password: "admin123",
    isAdmin: true,
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "123456",
    address: {
      street: "123 Apple Street",
      city: "Cupertino",
      state: "CA",
      zipCode: "95014",
      country: "USA",
    },
    phone: "+1-555-0123",
  },
];

const importData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const createdProducts = await Product.insertMany(products);

    console.log("Data Imported Successfully!");
    console.log(`Created ${createdUsers.length} users`);
    console.log(`Created ${createdProducts.length} products`);
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

const destroyData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    await Product.deleteMany();
    await User.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error destroying data:", error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
