const express = require("express");
const adminRouter = express.Router();

const isAuth = require("../middleware/verifyJwt");
const isAdmin = require("../middleware/isAdmin");
const {
  getAllUsers,
  getUserById,
  banUser,
  unbanUser,
  updateUserType,
} = require("../controller/adminUserController");
const {
  getAllRecipesAdmin,
  deleteRecipeAdmin,
} = require("../controller/adminRecipeController");

// all admin routes: auth + admin
adminRouter.use(isAuth, isAdmin);

// USER MANAGEMENT
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/:userId", getUserById);
adminRouter.patch("/users/:userId/ban", banUser);
adminRouter.patch("/users/:userId/unban", unbanUser);
adminRouter.patch("/users/:userId/user-type", updateUserType);

// RECIPE MANAGEMENT
adminRouter.get("/recipes", getAllRecipesAdmin);
adminRouter.delete("/recipes/:recipeId", deleteRecipeAdmin);

module.exports = adminRouter;
