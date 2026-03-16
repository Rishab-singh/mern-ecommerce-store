const express = require("express");

const { registerUser } = require("../controllers/Register");
const { loginUser,forgotPassword,resetPassword } = require("../controllers/Login");
const { verifyEmail } = require("../controllers/verifyEmail");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:token", resetPassword);

// ADD THIS ROUTE
router.get("/verify/:token", verifyEmail);

module.exports = router;