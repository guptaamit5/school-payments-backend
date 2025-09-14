const express = require("express");
const Orderstatus = require("../models/Orderstatus");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

// All transactions
router.get("/transactions", auth, async (req, res) => {
  const transactions = await OrderStatus.find().populate("collect_id");
  res.json(transactions);
});

// Transactions by school
router.get("/transactions/school/:schoolId", auth, async (req, res) => {
  const transactions = await OrderStatus.find().populate("collect_id");
  const result = transactions.filter(t => t.collect_id.school_id === req.params.schoolId);
  res.json(result);
});

// Check transaction status
router.get("/transaction-status/:id", auth, async (req, res) => {
  const status = await OrderStatus.findOne({ collect_id: req.params.id });
  res.json(status);
});

router.get("/test", (req, res) => {
  res.json({ message: "API working fine ✅" });
});

module.exports = router;
