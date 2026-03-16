const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  addToCart,
  getUserCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getUserCart);
router.put("/", protect, updateCartItem);

// ✅ FIXED ROUTE
router.delete("/:productId", protect, removeCartItem);

router.delete("/clear", protect, clearCart);

module.exports = router;