const { generateAccessToken, generateRefreshToken } = require("../auth/jwt");
const { User } = require("../db/models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

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

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUserType = userType.toLowerCase().trim();
    if (!["user", "admin"].includes(normalizedUserType)) {
      const error = new Error("Invalid user type");
      error.statusCode = 400;
      return next(error);
    }

    // Step3: DB checking exiting user
    const existingUser = await User.findOne({
      where: {
        email: normalizedEmail,
        userType: normalizedUserType,
      },
    });

    if (existingUser) {
      const error = new Error("User already exists with this role");
      error.statusCode = 409;
      throw error;
    }

    // Step4: hash the password.
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Step5: Create user.
    const user = await User.create({
      userType: normalizedUserType,
      username: username.toLowerCase().trim(),
      name: name.toLowerCase().trim(),
      email: normalizedEmail,
      phoneNumber,
      password: hashedPassword,
    });

    // Step6: Generate Token and making payload.
    const userPayload = {
      id: user.id,
      user: user.name,
      username: user.username,
      email: user.email,
      userType: user.userType,
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // Step7: Save refreshToken to the DB
    user.refreshToken = refreshToken;
    await user.save();

    // Step8: return response
    return res.status(201).json({
      success: true,
      message: "User created successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const signin = async (req, res, next) => {
  try {
    // Step1: get data from body
    const { userType, email, password } = req.body;

    // Step2: validate inputs
    if (!userType || !email || !password) {
      const error = new Error("Missing Credentials");
      error.statusCode = 400;
      return next(error);
    }

    const normalizedEmail = email.toLowerCase().trim();
    const normalizedUserType = userType.toLowerCase().trim();
    if (!["user", "admin"].includes(normalizedUserType)) {
      const error = new Error("Invalid user type");
      error.statusCode = 400;
      return next(error);
    }

    // Step3: DB checking exiting user
    const userByEmail = await User.findOne({
      where: {
        email: normalizedEmail,
      },
    });
    if (!userByEmail) {
      const error = new Error("User doesn't exists");
      error.statusCode = 404;
      throw error;
    }

    // Step4: check if userType matches
    if (userByEmail.userType !== normalizedUserType) {
      const error = new Error(
        `Access Denied: You are not allowed to perform this action'`
      );
      error.statusCode = 403;
      throw error;
    }

    // Step5: verify password
    const isMatch = await bcrypt.compare(password, userByEmail.password);
    if (!isMatch) {
      const error = new Error("Invalid email or password");
      error.statusCode = 401;
      throw error;
    }

    // Step6: Generate Token and making payload.
    const userPayload = {
      id: userByEmail.id,
      user: userByEmail.name,
      username: userByEmail.username,
      email: userByEmail.email,
      userType: userByEmail.userType,
    };
    const accessToken = generateAccessToken(userPayload);
    const refreshToken = generateRefreshToken(userPayload);

    // Step7: Save refreshToken to the DB
    userByEmail.refreshToken = refreshToken;
    await userByEmail.save();

    // Step: return response
    return res.status(201).json({
      success: true,
      message: "User logged successfully",
      accessToken,
      refreshToken,
    });
  } catch (error) {
    next(error);
  }
};

const refreshAccessToken = async (req, res, next) => {
  try {
    // Step1: Check the refresh token
    const { refreshToken } = req.body;
    if (!refreshToken) {
      const error = new Error("Refresh token required");
      error.statusCode = 401;
      throw error;
    }

    // Step2: Verify refresh token & it's expiry
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
      console.log(decoded);
    } catch (err) {
      const error = new Error("Invalid or expired refresh token");
      error.statusCode = 403;
      return next(error);
    }

    //Step3: Check that this token matches DB Refresh token
    const user = await User.findByPk(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      const error = new Error("Refresh token not found");
      error.statusCode = 403;
      throw error;
    }

    // Step4: Generate new access token || rotate refresh token
    const userPayload = {
      id: user.id,
      user: user.name,
      username: user.username,
      email: user.email,
      userType: user.userType,
    };
    const newAccessToken = generateAccessToken(userPayload);

    // Step5: make a new refresh token
    const newRefreshToken = generateRefreshToken(userPayload);
    user.refreshToken = newRefreshToken;
    await user.save();

    return res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken, // if rotating
    });
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    // Step1: get user id from decoded access token
    const userId = req.userPayload.id;

    // Step2: find user
    const user = await User.findByPk(userId);
    if (!user) {
      const error = new Error("user not found");
      error.statusCode = 404;
      next(error);
    }

    // Step3: invalidate refresh token
    user.refreshToken = null;
    await user.save();

    // Step4: respond
    return res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
  signin,
  refreshAccessToken,
  logout,
};
