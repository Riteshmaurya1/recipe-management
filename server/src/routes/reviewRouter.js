const express = require("express");
const reviewRouter = express.Router({ mergeParams: true });

const isAuth = require("../middleware/verifyJwt");
const {
  createOrUpdateReview,
  getRecipeReviews,
  deleteMyReview,
} = require("../controller/reviewController");

// POST /api/v1/recipes/:recipeId/reviews
reviewRouter.post("/", isAuth, createOrUpdateReview);

// GET /api/v1/recipes/:recipeId/reviews
reviewRouter.get("/", getRecipeReviews);

// DELETE /api/v1/recipes/:recipeId/reviews/me
reviewRouter.delete("/me", isAuth, deleteMyReview);

module.exports = reviewRouter;
