const express = require("express");
const Order = require("../models/Order");
const Cart = require("../models/Cart");
const { protect, admin } = require("../middleware/authMiddleware");
const router = express.Router();

// Create new order
router.post("/", protect, async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: "No order items" });
    }

    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    });

    const savedOrder = await order.save();

    // Clear the user's cart after successful order
    await Cart.findOneAndUpdate(
      { user: req.user._id },
      { items: [], totalAmount: 0 }
    );

    res.status(201).json({
      success: true,
      order: savedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get user orders
router.get("/myorders", protect, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({
      createdAt: -1,
    });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get order by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      // Check if user is admin or the order owner
      if (
        req.user.isAdmin ||
        order.user._id.toString() === req.user._id.toString()
      ) {
        res.json({
          success: true,
          order,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Not authorized to view this order",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update order to paid
router.put("/:id/pay", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (
        req.user.isAdmin ||
        order.user.toString() === req.user._id.toString()
      ) {
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.payer?.email_address,
        };

        const updatedOrder = await order.save();
        res.json({
          success: true,
          order: updatedOrder,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Not authorized to update this order",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update order to delivered (Admin only)
router.put("/:id/deliver", protect, admin, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.json({
        success: true,
        order: updatedOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get all orders (Admin only)
router.get("/", protect, admin, async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("user", "id name email")
      .sort({ createdAt: -1 });
    res.json({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Update order status (Admin only)
router.put("/:id/status", protect, admin, async (req, res) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (order) {
      order.status = status;
      const updatedOrder = await order.save();
      res.json({
        success: true,
        order: updatedOrder,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Cancel order
router.put("/:id/cancel", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      if (
        req.user.isAdmin ||
        order.user.toString() === req.user._id.toString()
      ) {
        if (order.status === "Delivered" || order.status === "Shipped" || order.status === "Out for delivery") {
          return res.status(400).json({
            success: false,
            message: "Cannot cancel order that has been shipped or delivered",
          });
        }

        order.status = "Cancelled";
        const updatedOrder = await order.save();
        res.json({
          success: true,
          order: updatedOrder,
        });
      } else {
        res.status(403).json({
          success: false,
          message: "Not authorized to cancel this order",
        });
      }
    } else {
      res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Edit order (Users can edit shipping address only if order is not shipped)
router.put("/:id/edit", protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to edit this order",
      });
    }

    // Only allow editing if order hasn't been shipped
    if (order.status === "Shipped" || order.status === "Out for delivery" || order.status === "Delivered") {
      return res.status(400).json({
        success: false,
        message: "Cannot edit order that has been shipped or delivered",
      });
    }

    const { shippingAddress } = req.body;

    if (shippingAddress) {
      order.shippingAddress = {
        ...order.shippingAddress,
        ...shippingAddress
      };
    }

    const updatedOrder = await order.save();
    res.json({
      success: true,
      order: updatedOrder,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
