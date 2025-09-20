const express = require("express");
const OrderStatus = require("../models/Orderstatus"); 
const auth = require("../middleware/authMiddleware");

const router = express.Router();


router.get("/transactions", auth, async (req, res) => {
  try {
    const transactions = await OrderStatus.find().populate("collect_id");
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transactions:", err);
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});


router.get("/transactions/school/:schoolId", auth, async (req, res) => {
  try {
    const transactions = await OrderStatus.find().populate("collect_id");
    const result = transactions.filter(
      (t) => t.collect_id && t.collect_id.school_id === req.params.schoolId
    );
    res.json(result);
  } catch (err) {
    console.error("Error fetching school transactions:", err);
    res.status(500).json({ error: "Failed to fetch school transactions" });
  }
});


router.get("/transaction-status/:id", auth, async (req, res) => {
  try {
    const status = await OrderStatus.findOne({ collect_id: req.params.id });
    if (!status) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(status);
  } catch (err) {
    console.error("Error fetching transaction status:", err);
    res.status(500).json({ error: "Failed to fetch transaction status" });
  }
});

router.get("/test", (req, res) => {
  res.json({ message: "API working fine" });
});

module.exports = router;
