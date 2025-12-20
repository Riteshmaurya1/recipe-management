const { User, Recipe } = require("../db/models");

// GET /api/v1/recipes  (browse + basic filters)
const getAllRecipes = async (req, res, next) => {
  try {
    const {
      search,
      difficulty,
      timeMin,
      timeMax,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    const where = { isPublic: true };

    if (difficulty) where.difficulty = difficulty;
    if (timeMin) where.cookingTime = { ...where.cookingTime, $gte: +timeMin };
    if (timeMax) where.cookingTime = { ...where.cookingTime, $lte: +timeMax };

    // simple search on title/description (adjust to Sequelize syntax)
    if (search) {
      where.title = { $iLike: `%${search}%` };
      // or use Op.iLike from Sequelize
    }

    const { rows, count } = await Recipe.findAndCountAll({
      where,
      offset,
      limit: +limit,
      order: [["createdAt", "DESC"]],
      include: [{ model: User, as: "author", attributes: ["id", "name"] }],
    });

    res.status(200).json({
      success: true,
      total: count,
      page: +page,
      limit: +limit,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/recipes/:id
const getRecipeById = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id, {
      include: [{ model: User, as: "author", attributes: ["id", "name"] }],
    });

    if (!recipe || !recipe.isPublic) {
      const error = new Error("Recipe not found");
      error.statusCode = 404;
      return next(error);
    }

    res.status(200).json({
      success: true,
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/recipes  (create)
const createRecipe = async (req, res, next) => {
  try {
    const userId = req.user.id;
    // Step1: get Data from the user.
    const {
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      imageUrl,
    } = req.body;

    // Step2: Validate all fields.
    if (
      !title ||
      !ingredients ||
      !instructions ||
      !cookingTime ||
      !servings ||
      !difficulty
    ) {
      const error = new Error("Missing required recipe fields");
      error.statusCode = 400;
      return next(error);
    }

    // Ste3: create recipe
    const recipe = await Recipe.create({
      title: title.trim(),
      description,
      ingredients, // expect array or JSON from frontend
      instructions,
      cookingTime,
      servings,
      difficulty: difficulty || "easy",
      imageUrl,
      userId: userId, // from auth middleware
    });

    return res.status(201).json({
      success: true,
      message: "Recipe created successfully",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// PUT /api/v1/recipes/:id  (update own recipe)
const updateRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) {
      const error = new Error("Recipe not found");
      error.statusCode = 404;
      return next(error);
    }

    // only owner (or admin later)
    if (recipe.userId !== req.user.id) {
      const error = new Error("Not allowed to edit this recipe");
      error.statusCode = 403;
      return next(error);
    }

    const {
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      imageUrl,
      isPublic,
    } = req.body;

    recipe.title = title ?? recipe.title;
    recipe.description = description ?? recipe.description;
    recipe.ingredients = ingredients ?? recipe.ingredients;
    recipe.instructions = instructions ?? recipe.instructions;
    recipe.cookingTime = cookingTime ?? recipe.cookingTime;
    recipe.servings = servings ?? recipe.servings;
    recipe.difficulty = difficulty ?? recipe.difficulty;
    recipe.imageUrl = imageUrl ?? recipe.imageUrl;
    if (typeof isPublic === "boolean") recipe.isPublic = isPublic;

    await recipe.save();

    res.status(200).json({
      success: true,
      message: "Recipe updated successfully",
      data: recipe,
    });
  } catch (error) {
    next(error);
  }
};

// DELETE /api/v1/recipes/:id  (delete own recipe)
const deleteRecipe = async (req, res, next) => {
  try {
    const recipe = await Recipe.findByPk(req.params.id);

    if (!recipe) {
      const error = new Error("Recipe not found");
      error.statusCode = 404;
      return next(error);
    }

    if (recipe.userId !== req.user.id) {
      const error = new Error("Not allowed to delete this recipe");
      error.statusCode = 403;
      return next(error);
    }

    await recipe.destroy();

    res.status(200).json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRecipes,
  getRecipeById,
  createRecipe,
  updateRecipe,
  deleteRecipe,
};
