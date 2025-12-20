const express = require("express");
const recipeRouter = express.Router();
const {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
} = require("../controller/recipeController");
const isAuth = require("../middleware/verifyJwt");

// Public browse
recipeRouter.get("/", getAllRecipes);
recipeRouter.get("/:id", getRecipeById);

// Protected Routes- user must be logged In
recipeRouter.post("/create", isAuth, createRecipe);
recipeRouter.put("/:id", isAuth, updateRecipe);
recipeRouter.delete("/delete/:id", isAuth, deleteRecipe);

module.exports = recipeRouter;
