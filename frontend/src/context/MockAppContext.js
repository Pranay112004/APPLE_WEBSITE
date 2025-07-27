import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within MockAppProvider");
  }
  return context;
};

// Mock Data
const mockProducts = [
  {
    _id: "1",
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
    _id: "2",
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
    _id: "3",
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
    _id: "4",
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
    _id: "5",
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
    _id: "6",
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

const mockUser = {
  _id: "user1",
  name: "John Doe",
  email: "john@example.com",
  isAdmin: false,
  address: {
    street: "123 Apple Street",
    city: "Cupertino",
    state: "CA",
    zipCode: "95014",
    country: "USA",
  },
  phone: "+1-555-0123",
};

const mockOrders = [
  {
    _id: "order1",
    orderItems: [
      {
        product: "1",
        name: "iPhone 15 Pro",
        image:
          "https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=400",
        price: 999,
        quantity: 1,
        size: "256GB",
        color: "Natural Titanium",
      },
    ],
    totalPrice: 1078.92,
    status: "Delivered",
    createdAt: "2024-01-15T10:30:00Z",
    deliveredAt: "2024-01-18T14:20:00Z",
  },
  {
    _id: "order2",
    orderItems: [
      {
        product: "5",
        name: "AirPods Pro (2nd generation)",
        image:
          "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400",
        price: 249,
        quantity: 1,
        color: "White",
      },
    ],
    totalPrice: 268.92,
    status: "Shipped",
    createdAt: "2024-01-20T09:15:00Z",
  },
];

export const MockAppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState(mockProducts);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("mockToken"));

  // Auth functions
  const login = async (email, password) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    if (email === "demo@apple.com" && password === "demo123") {
      const mockToken = "mock-jwt-token-" + Date.now();
      setToken(mockToken);
      setUser(mockUser);
      setOrders(mockOrders);
      localStorage.setItem("mockToken", mockToken);

      toast.success("Login successful!");
      setLoading(false);
      return { success: true };
    } else {
      toast.error("Invalid credentials. Use demo@apple.com / demo123");
      setLoading(false);
      return { success: false, message: "Invalid credentials" };
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const mockToken = "mock-jwt-token-" + Date.now();
    const newUser = {
      ...mockUser,
      name,
      email,
      _id: "user-" + Date.now(),
    };

    setToken(mockToken);
    setUser(newUser);
    localStorage.setItem("mockToken", mockToken);

    toast.success("Registration successful!");
    setLoading(false);
    return { success: true };
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart({ items: [], totalAmount: 0 });
    setOrders([]);
    localStorage.removeItem("mockToken");
    toast.success("Logged out successfully");
  };

  // Product functions
  const getProducts = async (filters = {}) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 500));

    let filteredProducts = [...mockProducts];

    if (filters.category) {
      filteredProducts = filteredProducts.filter(
        (p) => p.category === filters.category
      );
    }

    if (filters.search) {
      filteredProducts = filteredProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
          p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    if (filters.sort === "price-low-high") {
      filteredProducts.sort((a, b) => a.price - b.price);
    } else if (filters.sort === "price-high-low") {
      filteredProducts.sort((a, b) => b.price - a.price);
    }

    setProducts(filteredProducts);
    setLoading(false);
    return filteredProducts;
  };

  const getProduct = async (id) => {
    const product = mockProducts.find((p) => p._id === id);
    return product || null;
  };

  // Cart functions
  const addToCart = async (productId, quantity = 1, size = "", color = "") => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    const product = mockProducts.find((p) => p._id === productId);
    if (!product) {
      toast.error("Product not found");
      return;
    }

    const newCart = { ...cart };

    // Check if item already exists
    const existingItemIndex = newCart.items.findIndex(
      (item) =>
        item.product._id === productId &&
        item.size === size &&
        item.color === color
    );

    if (existingItemIndex > -1) {
      newCart.items[existingItemIndex].quantity += quantity;
    } else {
      newCart.items.push({
        _id: "item-" + Date.now(),
        product,
        quantity,
        size,
        color,
        price: product.price,
      });
    }

    // Calculate total
    newCart.totalAmount = newCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCart(newCart);
    toast.success("Item added to cart!");
  };

  const updateCartItem = async (itemId, quantity) => {
    const newCart = { ...cart };
    const itemIndex = newCart.items.findIndex((item) => item._id === itemId);

    if (itemIndex === -1) return;

    if (quantity <= 0) {
      newCart.items.splice(itemIndex, 1);
    } else {
      newCart.items[itemIndex].quantity = quantity;
    }

    // Recalculate total
    newCart.totalAmount = newCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCart(newCart);
  };

  const removeFromCart = async (itemId) => {
    const newCart = { ...cart };
    newCart.items = newCart.items.filter((item) => item._id !== itemId);

    // Recalculate total
    newCart.totalAmount = newCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    setCart(newCart);
    toast.success("Item removed from cart");
  };

  const clearCart = () => {
    setCart({ items: [], totalAmount: 0 });
  };

  // Order functions
  const createOrder = async (orderData) => {
    setLoading(true);

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newOrder = {
      _id: "order-" + Date.now(),
      ...orderData,
      status: "Order Placed",
      createdAt: new Date().toISOString(),
      isPaid: orderData.paymentMethod !== "COD",
    };

    setOrders([newOrder, ...orders]);
    clearCart();

    setLoading(false);
    toast.success("Order placed successfully!");
    return newOrder;
  };

  // Initialize mock data
  React.useEffect(() => {
    if (token) {
      setUser(mockUser);
      setOrders(mockOrders);
    }
  }, [token]);

  const value = {
    user,
    products,
    cart,
    orders,
    loading,
    token,
    backendUrl: "http://localhost:5000", // Mock backend URL
    login,
    register,
    logout,
    getProducts,
    getProduct,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
