const bcrypt = require("bcryptjs");
const { User } = require("../db/models");

const getProfile = async (req, res, next) => {
  try {
    // Step1: fetch user
    const { id, user, username, email, phoneNumber, userType } = req.payload;

    // Step2: return response
    res.status(200).json({
      success: true,
      data: { id, user, username, email, phoneNumber, userType },
    });
  } catch (error) {
    next(error);
  }
};
const updateProfile = async (req, res, next) => {
  try {
    // Step1: Authenticated user from middleware
    const user = req.user;

    // Step2: Extract allowed fields
    const { name, username, phoneNumber, password } = req.body;

    // Step3: Update fields if provided
    if (name) {
      user.name = name.trim();
    }
    if (username) {
      // Optional: check uniqueness
      const existingUsername = await User.findOne({
        where: { username: username.trim() },
      });

      if (existingUsername && existingUsername.id !== user.id) {
        const err = new Error("Username already taken");
        err.statusCode = 409;
        throw err;
      }

      user.username = username.trim();
    }
    if (phoneNumber) {
      user.phoneNumber = phoneNumber.toString();
    }
    if (password) {
      const saltRound = 10;
      user.password = await bcrypt.hash(password, saltRound);
    }

    // Step4: Save changes
    await user.save();

    // Step5: Response
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
