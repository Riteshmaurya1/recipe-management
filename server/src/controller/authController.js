const { generateAccessToken } = require("../auth/jwt");
const { User } = require("../db/models");
const bcrypt = require("bcryptjs");

const signup = async (req, res, next) => {
  try {
    // Step1: get data from body
    const { userType, username, name, email, phoneNumber, password } = req.body;

    // Step2: validate inputs
    if (
      !userType ||
      !username ||
      !name ||
      !email ||
      !phoneNumber ||
      !password
    ) {
      const error = new Error("Missing Credentials");
      error.statusCode = 400;
      return next(error);
    }

    // Step3: DB checking exiting user
    const ExistingUser = await User.findOne({
      where: {
        email: email.toLowerCase().trim(),
        phoneNumber: phoneNumber.toString(),
      },
    });
    if (ExistingUser) {
      const error = new Error("User already exists");
      error.statusCode = 409;
      throw error;
    }

    // Step4: hash the password.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step5: Create user.
    const user = await User.create({
      userType,
      username: username.toLowerCase().trim(),
      name: name.toLowerCase().trim(),
      email: email.toLowerCase().trim(),
      phoneNumber,
      password: hashedPassword,
    });

    // Step6: Generate Token and making payload.
    const userPayload = {
      id: user.id,
      user: user.name,
      username: user.username,
      email: user.email,
    };
    const accessToken = generateAccessToken(userPayload);

    // Step: return response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
};
