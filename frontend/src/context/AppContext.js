import React, { createContext, useContext, useEffect, useState } from "react";
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

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], totalAmount: 0 });
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const backendUrl =
    process.env.REACT_APP_BACKEND_URL || "http://localhost:5000";

  // Set axios defaults
  axios.defaults.baseURL = `${backendUrl}/api`;
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // Auth functions
  const login = async (email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/users/login", { email, password });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Login successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (name, email, password) => {
    try {
      setLoading(true);
      const response = await axios.post("/users/register", {
        name,
        email,
        password,
      });
      const { token, user } = response.data;

      setToken(token);
      setUser(user);
      localStorage.setItem("token", token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      toast.success("Registration successful!");
      return { success: true };
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
      return { success: false, message: error.response?.data?.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setCart({ items: [], totalAmount: 0 });
    localStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    toast.success("Logged out successfully");
  };

  // Product functions
  const getProducts = async (filters = {}) => {
    try {
      setLoading(true);
      const response = await axios.get("/products", { params: filters });
      setProducts(response.data.products);
      return response.data.products;
    } catch (error) {
      toast.error("Failed to fetch products");
      return [];
    } finally {
      setLoading(false);
    }
  };

  // Cart functions
  const getCart = async () => {
    if (!token) return;
    try {
      const response = await axios.get("/cart");
      setCart(response.data.cart);
    } catch (error) {
      console.error("Failed to fetch cart:", error);
    }
  };

  const addToCart = async (productId, quantity = 1, size = "", color = "") => {
    if (!token) {
      toast.error("Please login to add items to cart");
      return;
    }

    try {
      const response = await axios.post("/cart/add", {
        productId,
        quantity,
        size,
        color,
      });
      setCart(response.data.cart);
      toast.success("Item added to cart!");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to add item to cart"
      );
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const response = await axios.put(`/cart/update/${itemId}`, { quantity });
      setCart(response.data.cart);
    } catch (error) {
      toast.error("Failed to update cart item");
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await axios.delete(`/cart/remove/${itemId}`);
      setCart(response.data.cart);
      toast.success("Item removed from cart");
    } catch (error) {
      toast.error("Failed to remove item from cart");
    }
  };

  // Initialize data
  useEffect(() => {
    getProducts();
    if (token) {
      getCart();
    }
  }, [token]);

  const value = {
    user,
    products,
    cart,
    loading,
    token,
    backendUrl,
    login,
    register,
    logout,
    getProducts,
    addToCart,
    updateCartItem,
    removeFromCart,
    getCart,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
