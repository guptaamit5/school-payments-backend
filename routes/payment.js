// routes/payment.js
const express = require("express");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const Orderstatus = require("../models/Orderstatus"); // <- make sure filename matches exactly
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// Create payment
router.post("/create-payment", auth, async (req, res) => {
  try {
    // log request body to help debug
    console.log("create-payment body:", req.body);

    const { school_id, trustee_id, student_info, order_amount } = req.body;

    // basic validation
    if (!student_info || !order_amount) {
      return res.status(400).json({ error: "student_info and order_amount are required" });
    }

    const newOrder = await Order.create({
      school_id: school_id || null,
      trustee_id: trustee_id || null,
      student_info,
      gateway_name: "PhonePe"
    });

    // ensure PG_KEY exists (for debugging fallback provided, but set real PG_KEY in .env)
    const pgSecret = process.env.PG_KEY || "dev_pg_key";
    const token = jwt.sign(
      { collect_id: newOrder._id.toString(), order_amount },
      pgSecret
    );

    // create initial order status
    await Orderstatus.create({
      collect_id: newOrder._id,
      order_amount,
      status: "pending",
      payment_time: new Date()
    });

    res.json({
      payment_url: "https://mock-payment.com/redirect",
      collect_id: newOrder._id
    });
  } catch (err) {
    // log full error (stack) so we can see exact problem in terminal
    console.error("Create-payment ERROR:", err);
    // return real error message to Postman (temporarily) so you can debug
    res.status(500).json({ error: err.message || "Payment creation failed" });
  }
});

// Webhook endpoint (left as-is, but make sure OrderStatus variable name matches)
router.post("/webhook", async (req, res) => {
  try {
    const data = req.body.order_info;
    await Orderstatus.findOneAndUpdate(
      { collect_id: data.order_id },
      {
        transaction_amount: data.transaction_amount,
        payment_mode: data.payment_mode,
        payment_details: data.payment_details,
        bank_reference: data.bank_reference,
        status: data.status,
        payment_message: data.payment_message,
        payment_time: data.payment_time,
        error_message: data.error_message
      }
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Webhook ERROR:", err);
    res.status(500).json({ error: "Webhook handling failed" });
  }
});

module.exports = router;
