const User = require("../models/User");

exports.verifyEmail = async (req, res) => {
  try {

    const user = await User.findOne({
      verificationToken: req.params.token
    });

    if (!user) {
      return res.status(400).send("Invalid verification link");
    }

    user.isVerified = true;
    user.verificationToken = null;

    await user.save();

    res.send("Email verified successfully. You can now login.");

  } catch (error) {
    res.status(500).send(error.message);
  }
};