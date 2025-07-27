const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const router = express.Router();

// Create Razorpay order (for UI display only)
router.post("/razorpay/create-order", protect, async (req, res) => {
  try {
    const { amount } = req.body;

    // Create a mock order response for UI display
    const mockOrder = {
      id: `order_mock_${Date.now()}`,
      entity: "order",
      amount: amount * 100, // Convert to paise for Razorpay format
      amount_paid: 0,
      amount_due: amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
      status: "created",
      attempts: 0,
      notes: {},
      created_at: Math.floor(Date.now() / 1000),
    };

    res.json({
      success: true,
      order: mockOrder,
      key_id: process.env.RAZORPAY_KEY_ID || "demo_key_id",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Verify payment (mock verification for demo)
router.post("/razorpay/verify", protect, async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    // Mock verification - always return success for demo
    res.json({
      success: true,
      message: "Payment verified successfully (Demo Mode)",
      payment_details: {
        order_id: razorpay_order_id,
        payment_id: razorpay_payment_id,
        signature: razorpay_signature,
        status: "success",
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// Get payment status
router.get("/status/:orderId", protect, async (req, res) => {
  try {
    const { orderId } = req.params;

    // Mock payment status
    res.json({
      success: true,
      payment_status: "completed",
      order_id: orderId,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
