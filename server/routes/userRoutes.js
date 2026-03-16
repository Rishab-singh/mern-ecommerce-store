const express = require("express");
const router = express.Router();

const { protect, admin } = require("../middleware/authMiddleware");
const User = require("../models/User");


// ================= GET USER PROFILE =================
router.get("/profile", protect, (req, res) => {
  res.json(req.user);
});


// ================= ADMIN DASHBOARD TEST =================
router.get("/admin-dashboard", protect, admin, (req, res) => {
  res.json({ message: "Welcome Admin" });
});


// ================= GET ALL USERS (ADMIN) =================
router.get("/", protect, admin, async (req, res) => {
  try {

    const users = await User.find().select("-password");

    res.json(users);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


// ================= DELETE USER (ADMIN) =================
router.delete("/:id", protect, admin, async (req, res) => {
  try {

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


// ================= MAKE USER ADMIN =================
router.put("/make-admin/:id", protect, admin, async (req, res) => {
  try {

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "admin";

    await user.save();

    res.json({ message: "User promoted to admin" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});


module.exports = router;