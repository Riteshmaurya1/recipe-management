const { Favorite, Recipe } = require("../db/models");

const addFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    const [fav, created] = await Favorite.findOrCreate({
      where: { userId, recipeId },
    });

    if (!created) {
      const error = new Error("Recipe already in favorites");
      error.status = 404;
      next(error);
    }

    return res.status(201).json({
      success: true,
      message: "Recipe added to favorites",
    });
  } catch (error) {
    next(error);
  }
};

const removeFavorite = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { recipeId } = req.params;

    await Favorite.destroy({ where: { userId, recipeId } });

    return res.status(200).json({
      success: true,
      message: "Recipe removed from favorites",
    });
  } catch (error) {
    next(error);
  }
};

const getMyFavorites = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const favorites = await Favorite.findAll({
      where: { userId },
      include: [
        {
          model: Recipe,
          as: "recipe",
          attributes: ["id", "title", "imageUrl", "category", "createdAt"],
        },
      ],
    });
    if (!favorites) {
      const error = new Error("No favorites found.");
      error.status = 404;
      next(error);
    }

    return res.status(200).json({
      success: true,
      total: favorites.length,
      data: favorites,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  addFavorite,
  removeFavorite,
  getMyFavorites,
};
