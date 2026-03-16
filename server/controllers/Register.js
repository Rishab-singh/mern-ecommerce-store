const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

exports.registerUser = async (req, res) => {
  try {

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // create verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      isVerified: false
    });

    const verifyURL = `http://localhost:5000/api/auth/verify/${verificationToken}`;

    await sendEmail(
      email,
      "Verify your Email",
      `
      <h2>Email Verification</h2>
      <p>Please click the link below to verify your email:</p>
      <a href="${verifyURL}">Verify Email</a>
      `
    );

    res.status(201).json({
      message: "Registration successful. Please check your email to verify your account."
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};