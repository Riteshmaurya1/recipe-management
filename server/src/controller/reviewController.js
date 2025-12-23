const { Review, User } = require("../db/models");
const { fn, col } = require("sequelize");

const createOrUpdateReview = async (req, res, next) => {
  try {
    const userId = req.user.id;       // UUID from JWT middleware
    const { recipeId } = req.params;  // UUID from route
    const { rating, comment } = req.body;

    // validate rating
    if (!rating || rating < 1 || rating > 5) {
      const err = new Error("Rating must be between 1 and 5");
      err.statusCode = 400;
      return next(err);
    }

    // check if review exists
    const existing = await Review.findOne({
      where: { userId, recipeId },
    });

    if (existing) {
      existing.rating = rating;
      if (comment !== undefined) existing.comment = comment;
      await existing.save();

      return res.status(200).json({
        success: true,
        message: "Review updated successfully",
      });
    }

    await Review.create({
      userId,
      recipeId,
      rating,
      comment: comment || null,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
    });
  } catch (error) {
    next(error);
  }
};

const getRecipeReviews = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const reviews = await Review.findAll({
      where: { recipeId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    const avgResult = await Review.findOne({
      where: { recipeId },
      attributes: [[fn("AVG", col("rating")), "avgRating"]],
      raw: true,
    });

    const avgRating = avgResult && avgResult.avgRating
      ? Number(avgResult.avgRating).toFixed(1)
      : null;

    return res.status(200).json({
      success: true,
      total: reviews.length,
      averageRating: avgRating,
      data: reviews,
    });
  } catch (error) {
    next(error);
  }
};

const deleteMyReview = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const deleted = await Review.destroy({
      where: { userId, recipeId },
    });

    if (!deleted) {
      const err = new Error("Review not found");
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrUpdateReview,
  getRecipeReviews,
  deleteMyReview,
};