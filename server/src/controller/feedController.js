const { Follow, Recipe, Review, User } = require("../db/models");
const { Op } = require("sequelize");

// GET /api/v1/feed
const getMyFeed = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { limit = 20, offset = 0 } = req.query;

    // 1) Get list of userIds that I follow
    const follows = await Follow.findAll({
      where: { followerId: userId },
      attributes: ["followingId"],
      raw: true,
    });

    const followingIds = follows.map((f) => f.followingId);

    if (followingIds.length === 0) {
      return res.status(200).json({
        success: true,
        total: 0,
        data: [],
      });
    }

    // 2) Get recent recipes by followed users
    const recipeEvents = await Recipe.findAll({
      where: { userId: { [Op.in]: followingIds } },
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset: +offset,
    });

    // Map to unified event format
    const recipeFeed = recipeEvents.map((r) => ({
      type: "recipe",
      id: r.id,
      createdAt: r.createdAt,
      author: r.author,
      title: r.title,
      description: r.description,
    }));

    // 3) Get recent reviews by followed users
    const reviewEvents = await Review.findAll({
      where: { userId: { [Op.in]: followingIds } },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Recipe,
          as: "recipe",
          attributes: ["id", "title"],
        },
      ],
      order: [["createdAt", "DESC"]],
      limit: +limit,
      offset: +offset,
    });

    const reviewFeed = reviewEvents.map((rev) => ({
      type: "review",
      id: rev.id,
      createdAt: rev.createdAt,
      author: rev.user,
      recipe: rev.recipe,
      rating: rev.rating,
      comment: rev.comment,
    }));

    // 4) Merge and sort by createdAt desc
    const merged = [...recipeFeed, ...reviewFeed].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    return res.status(200).json({
      success: true,
      total: merged.length,
      data: merged.slice(0, +limit),
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getMyFeed };
