const { User, Recipe,sequelize } = require("../db/models");
const { Op } = require("sequelize");

// GET /api/v1/recipes  (browse + basic filters)
const getAllRecipes = async (req, res, next) => {
  try {
    const {
      search,
      ingredient,
      category,
      diet,
      difficulty,
      timeMin,
      timeMax,
      page = 1,
      limit = 10,
    } = req.query;

    const offset = (page - 1) * limit;

    // Step1: Base conditions
    const where = { isPublic: true };

    // Step2: filter by difficulty.
    if (difficulty) {
      where.difficulty = difficulty;
    }

    // Step3: Filter by cooking time
    if (timeMin || timeMax) {
      where.cookingTime = {};
      if (timeMin) where.cookingTime[Op.gte] = +timeMin;
      if (timeMax) where.cookingTime[Op.lte] = +timeMax;
    }

    //Step4: Filter by dietary tag
    if (diet) {
      where.dietaryTags = { [Op.contains]: [diet] };
    }

    //Step5: Filter by category
    if (category) {
      where.category = category;
    }

    //Step6: Search in title and description
    if (search) {
      where[Op.or] = [
        { title: { [Op.iLike]: `%${search}%` } },
        { description: { [Op.iLike]: `%${search}%` } },
      ];
    }

    // Step7: Search by ingredient (partial match in ingredients array)
    // if (ingredient) {
    //   where.ingredients = { [Op.contains]: [ingredient] };
    // }
     // ingredient substring search: Op.iLike '%paneer%'
    const havingIngredient = ingredient
      ? sequelize.where(
          // cast jsonb array to text
          sequelize.cast(sequelize.col("ingredients"), "text"),
          {
            [Op.iLike]: `%${ingredient}%`,
          }
        )
      : null;

    const { rows, count } = await Recipe.findAndCountAll({
      where,
      ...(havingIngredient && { where: { ...where, [Op.and]: [havingIngredient] } }),
      offset,
      limit: +limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: User,
          as: "author",
          attributes: ["id", "name"],
        },
      ],
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

    // Step1: get Data from the user
    const {
      title,
      description,
      ingredients,
      instructions,
      cookingTime,
      servings,
      difficulty,
      imageUrl,
      category,
      dietaryTags,
    } = req.body;

    // Step2: Validate all required fields
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

    // Optional: validate cookingTime and servings are numbers
    if (isNaN(cookingTime) || cookingTime <= 0) {
      const error = new Error("Cooking time must be a positive number");
      error.statusCode = 400;
      return next(error);
    }
    if (isNaN(servings) || servings <= 0) {
      const error = new Error("Servings must be a positive number");
      error.statusCode = 400;
      return next(error);
    }

    // Optional: validate difficulty
    const validDifficulties = ["easy", "medium", "hard"];
    if (!validDifficulties.includes(difficulty)) {
      const error = new Error("Invalid difficulty level");
      error.statusCode = 400;
      return next(error);
    }

    // Step3: create recipe
    const recipe = await Recipe.create({
      title: title.trim(),
      description: description?.trim() || null,
      ingredients, // array of strings
      instructions: instructions.trim(),
      cookingTime: +cookingTime,
      servings: +servings,
      difficulty: difficulty,
      imageUrl: imageUrl?.trim() || null,
      category: category?.trim() || null,
      dietaryTags: Array.isArray(dietaryTags) ? dietaryTags : [],
      userId: userId,
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
      category,
      dietaryTags,
    } = req.body;

    recipe.title = title ?? recipe.title;
    recipe.description = description ?? recipe.description;
    recipe.ingredients = ingredients ?? recipe.ingredients;
    recipe.instructions = instructions ?? recipe.instructions;
    recipe.cookingTime = cookingTime ?? recipe.cookingTime;
    recipe.servings = servings ?? recipe.servings;
    recipe.difficulty = difficulty ?? recipe.difficulty;
    recipe.imageUrl = imageUrl ?? recipe.imageUrl;
    recipe.category = category ?? recipe.category;
    recipe.dietaryTags = dietaryTags ?? recipe.dietaryTags;
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
