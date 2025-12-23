const { User, Recipe } = require("../db/models");

const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "username", "name", "email", "userType", "createdAt"],
      order: [["createdAt", "DESC"]],
      paranoid: false, // include banned (soft-deleted) users
    });

    return res.status(200).json({
      success: true,
      total: users.length,
      data: users,
    });
  } catch (error) {
    next(error);
  }
};

const getUserById = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, {
      attributes: ["id", "username", "name", "email", "userType", "createdAt"],
      paranoid: false,
      include: [
        {
          model: Recipe,
          as: "recipes", // ensure User.hasMany(Recipe, { as: "recipes", foreignKey: "userId" })
          attributes: ["id", "title", "createdAt"],
        },
      ],
    });

    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

const banUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    await user.destroy(); // paranoid: true => soft delete

    return res.status(200).json({
      success: true,
      message: "User banned (soft deleted) successfully",
    });
  } catch (error) {
    next(error);
  }
};

const unbanUser = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    await user.restore();

    return res.status(200).json({
      success: true,
      message: "User unbanned (restored) successfully",
    });
  } catch (error) {
    next(error);
  }
};

const updateUserType = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { userType } = req.body; // "user" or "admin"

    if (!["user", "admin"].includes(userType)) {
      const err = new Error("Invalid userType");
      err.statusCode = 400;
      return next(err);
    }

    const user = await User.findByPk(userId, { paranoid: false });
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 404;
      return next(err);
    }

    user.userType = userType;
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User type updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  updateUserType,
};
