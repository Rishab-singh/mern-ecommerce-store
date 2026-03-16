const express = require("express");
const router = express.Router();

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  addProductReview   // ⭐ add this
} = require("../controllers/productController");

const { protect, admin } = require("../middleware/authMiddleware");

// ================= PUBLIC ROUTES =================
router.get("/", getProducts);
router.get("/:id", getProductById);

// ================= REVIEW ROUTE =================
router.post("/:id/reviews", protect, addProductReview);

// ================= ADMIN ROUTES =================
router.post("/", protect, admin, createProduct);
router.put("/:id", protect, admin, updateProduct);
router.delete("/:id", protect, admin, deleteProduct);

module.exports = router;