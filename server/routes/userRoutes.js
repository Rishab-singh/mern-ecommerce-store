const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");

// ================= GET ALL USERS (ADMIN) =================
router.get("/", protect, admin, async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const searchTerm = req.query.search?.trim() || null;
    const role = req.query.role || null;

    let query = {};

if (searchTerm) {
  query.$or = [
    { name: { $regex: searchTerm, $options: "i" } },
    { email: { $regex: searchTerm, $options: "i" } },
  ];
}

if (role) {
  query.role = role;
}

    const count = await User.countDocuments(query);

    const users = await User.find(query)
      .select("-password")
      .sort(req.query.sort || "-createdAt")
      .limit(limit)
      .skip((page - 1) * limit);

    res.json({
      success: true,
      users,
      page,
      pages: Math.ceil(count / limit),
      total: count,
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      users: [],
    });
  }
});

// ================= DELETE USER =================
router.delete("/:id", protect, admin, async (req, res) => {
  try {
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    await user.deleteOne();

    res.json({ message: "User deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;