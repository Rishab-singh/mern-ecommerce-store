const express = require("express");

// Middleware
const { protect, admin } = require("../middleware/authMiddleware");

// Controllers
const {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  markOrderAsPaid,
  markOrderAsDelivered,
  updateOrderStatus
} = require("../controllers/orderController");

const router = express.Router();

/**
 * CREATE ORDER
 * POST /api/orders
 */
router.post("/", protect, createOrder);

/**
 * GET MY ORDERS
 * GET /api/orders/my
 */
router.get("/my", protect, getMyOrders);

/**
 * GET SINGLE ORDER (FOR TRACKING PAGE)
 * GET /api/orders/:id
 */
router.get("/:id", protect, getOrderById);

/**
 * ADMIN: GET ALL ORDERS
 * GET /api/orders
 */
router.get("/", protect, admin, getAllOrders);

/**
 * MARK ORDER AS PAID
 * PUT /api/orders/:id/pay
 */
router.put("/:id/pay", protect, markOrderAsPaid);

/**
 * UPDATE ORDER STATUS (ADMIN)
 * PUT /api/orders/:id/status
 */
router.put("/:id/status", protect, admin, updateOrderStatus);

/**
 * MARK ORDER AS DELIVERED
 * PUT /api/orders/:id/deliver
 */
router.put("/:id/deliver", protect, admin, markOrderAsDelivered);

module.exports = router;