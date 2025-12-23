const { Recipe, User } = require("../db/models");

const getAllRecipesAdmin = async (req, res, next) => {
  try {
    const recipes = await Recipe.findAll({
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
    });

    return res.status(200).json({
      success: true,
      total: recipes.length,
      data: recipes,
    });
  } catch (error) {
    next(error);
  }
};

const deleteRecipeAdmin = async (req, res, next) => {
  try {
    const { recipeId } = req.params;

    const deleted = await Recipe.destroy({
      where: { id: recipeId },
    });

    if (!deleted) {
      const err = new Error("Recipe not found");
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({
      success: true,
      message: "Recipe removed successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipesAdmin,
  deleteRecipeAdmin,
};
