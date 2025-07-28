import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback, // Import useCallback
} from "react";
import axios from "axios";
import { toast } from "react-toastify";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

// Configure axios defaults
const API_URL = process.env.REACT_APP_API_URL || "/api";
axios.defaults.baseURL = API_URL;

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const userData = localStorage.getItem("user");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  // --- MEMOIZED FUNCTIONS WITH useCallback ---

  // Memoize getCart to prevent re-renders
  const getCart = useCallback(async () => {
    try {
      const { data } = await axios.get("/cart");
      setCart(data.cart);
      return data.cart;
    } catch (error) {
      // Don't toast here, it can be annoying on page load
      console.error("Error fetching cart:", error);
      return null;
    }
  }, []);

  // Memoize getOrders to prevent re-renders
  const getOrders = useCallback(async () => {
    try {
      const { data } = await axios.get("/orders/myorders");
      setOrders(data.orders);
      return data.orders;
    } catch (error) {
      console.error("Error fetching orders:", error);
      return [];
    }
  }, []);

  // Set axios token header whenever the token changes
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common["Authorization"];
    }
  }, [token]);

  // Load user-specific data (cart, orders) on login
  useEffect(() => {
    if (user && token) {
      getCart();
      getOrders();
    }
  }, [user, token, getCart, getOrders]); // Add memoized functions to dependency array

  // --- AUTH FUNCTIONS ---
  const login = async (email, password) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/login", { email, password });

      setUser(data);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password, address, phone) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/users/register", {
        name,
        email,
        password,
        address,
        phone,
      });

      setUser(data);
      setToken(data.token);
      localStorage.setItem("user", JSON.stringify(data));
      localStorage.setItem("token", data.token);

      toast.success("Registration successful!");
      return { success: true };
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setCart({ items: [], totalAmount: 0 });
    setOrders([]);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.info("You have been logged out.");
  };

  // --- PRODUCT FUNCTIONS ---
  const getProducts = useCallback(async (filters = {}) => {
    try {
      setLoading(true);
      console.log("Fetching products with filters:", filters);
      console.log("API Base URL:", API_URL);
      
      const params = new URLSearchParams();

      if (filters.category) params.append("category", filters.category);
      if (filters.search) params.append("search", filters.search);
      if (filters.sort) params.append("sort", filters.sort);

      const url = `/products?${params}`;
      console.log("Making request to:", `${API_URL}${url}`);
      
      const { data } = await axios.get(url);
      console.log("Products fetched successfully:", data.products?.length || 0);
      setProducts(data.products || []);
      return data.products || [];
    } catch (error) {
      console.error("Error fetching products:", error);
      console.error("Error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        baseURL: error.config?.baseURL,
        url: error.config?.url
      });
      toast.error(`Failed to fetch products: ${error.message}`);
      setProducts([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []); // Empty dependency array means this function is created only once

  const getProduct = useCallback(async (id) => {
    try {
      const { data } = await axios.get(`/products/${id}`);
      return data.product;
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Product not found");
      return null;
    }
  }, []);

  // --- CART FUNCTIONS ---
  const addToCart = async (productId, quantity = 1, size = "", color = "") => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }
    try {
      const { data } = await axios.post("/cart/add", {
        productId,
        quantity,
        size,
        color,
      });
      setCart(data.cart);
      toast.success("Item added to cart!");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const { data } = await axios.put(`/cart/update/${itemId}`, { quantity });
      setCart(data.cart);
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update cart";
      toast.error(message);
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const { data } = await axios.delete(`/cart/remove/${itemId}`);
      setCart(data.cart);
      toast.success("Item removed from cart");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to remove item";
      toast.error(message);
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/cart/clear");
      setCart({ items: [], totalAmount: 0 });
      toast.success("Cart cleared");
    } catch (error) {
      const message = error.response?.data?.message || "Failed to clear cart";
      toast.error(message);
    }
  };

  // --- ORDER FUNCTIONS ---
  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const { data } = await axios.post("/orders", orderData);
      await getOrders(); // Refresh orders
      setCart({ items: [], totalAmount: 0 }); // Clear cart
      toast.success("Order placed successfully!");
      return data.order;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create order";
      toast.error(message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getOrder = useCallback(async (orderId) => {
    try {
      const { data } = await axios.get(`/orders/${orderId}`);
      return data.order;
    } catch (error) {
      console.error("Error fetching order:", error);
      return null;
    }
  }, []);

  const cancelOrder = async (orderId) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/orders/${orderId}/cancel`);
      await getOrders(); // Refresh orders
      toast.success("Order cancelled successfully!");
      return { success: true, order: data.order };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to cancel order";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  const editOrder = async (orderId, updateData) => {
    try {
      setLoading(true);
      const { data } = await axios.put(`/orders/${orderId}/edit`, updateData);
      await getOrders(); // Refresh orders
      toast.success("Order updated successfully!");
      return { success: true, order: data.order };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update order";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // --- USER PROFILE FUNCTIONS ---
  const updateProfile = async (profileData, avatarFile = null) => {
    try {
      setLoading(true);
      
      // Create FormData if avatar file is provided
      let requestData;
      let config = {};
      
      if (avatarFile) {
        requestData = new FormData();
        requestData.append('avatar', avatarFile);
        
        // Append other profile data
        Object.keys(profileData).forEach(key => {
          if (key === 'address' && typeof profileData[key] === 'object') {
            // Handle nested address object
            Object.keys(profileData[key]).forEach(addressKey => {
              requestData.append(`address.${addressKey}`, profileData[key][addressKey]);
            });
          } else {
            requestData.append(key, profileData[key]);
          }
        });
        
        config.headers = {
          'Content-Type': 'multipart/form-data',
        };
      } else {
        requestData = profileData;
        config.headers = {
          'Content-Type': 'application/json',
        };
      }
      
      const { data } = await axios.put("/users/profile", requestData, config);
      
      // Update user state with new profile data
      const updatedUser = { ...user, ...data };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      toast.success("Profile updated successfully!");
      return { success: true, user: updatedUser };
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update profile";
      toast.error(message);
      return { success: false, message };
    } finally {
      setLoading(false);
    }
  };

  // --- PAYMENT FUNCTIONS ---
  const createPaymentOrder = async (amount) => {
    // ... implementation
  };

  const verifyPayment = async (paymentData) => {
    // ... implementation
  };

  // --- CONTEXT VALUE ---
  const value = {
    user,
    products,
    cart,
    orders,
    loading,
    setLoading, // Pass setLoading to the context
    token,
    backendUrl: API_URL,
    login,
    register,
    logout,
    updateProfile,
    getProducts,
    getProduct,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    createOrder,
    getOrder,
    getOrders,
    cancelOrder,
    editOrder,
    createPaymentOrder,
    verifyPayment,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
