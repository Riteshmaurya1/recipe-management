// src/routes/favoriteRoutes.js
const express = require("express");
const favoriteRouter = express.Router();

const isAuth = require("../middleware/verifyJwt");
const {
  addFavorite,
  removeFavorite,
  getMyFavorites,
} = require("../controller/favoriteController");

// Add recipe to favorites
favoriteRouter.post("/add/:recipeId", isAuth, addFavorite);

// Remove recipe from favorites
favoriteRouter.delete("/delete/:recipeId", isAuth, removeFavorite);

// Get current user's favorites
favoriteRouter.get("/all", isAuth, getMyFavorites);

module.exports = favoriteRouter;
