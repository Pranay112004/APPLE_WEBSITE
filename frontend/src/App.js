import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Real Context (connects to backend API)
import { AppProvider } from "./context/RealAppContext"; // ✅ Backend API integration

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Home from "./pages/Home";
import Products from "./pages/Products";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderConfirmation from "./pages/OrderConfirmation";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";

// Styles
import "./App.css";

function App() {
  return (
    <AppProvider>
      {" "}
      {/* ✅ Provider wraps everything */}
      <Router>
        <div className="App">
          <ScrollToTop />
          <Navbar /> {/* ✅ Navbar is inside the provider */}
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/admin" element={<Admin />} />
              <Route
                path="/order-confirmation/:orderId"
                element={<OrderConfirmation />}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            toastClassName="custom-toast"
            bodyClassName="custom-toast-body"
          />
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
