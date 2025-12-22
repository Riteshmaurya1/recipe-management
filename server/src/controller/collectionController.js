const { Collection, Recipe } = require("../db/models");

const createCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { name } = req.body;

    if (!name) {
      const err = new Error("Collection name is required");
      err.statusCode = 400;
      return next(err);
    }

    const collection = await Collection.create({ name, userId });

    return res.status(201).json({
      success: true,
      message: "Collection created successfully",
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

const getMyCollections = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const collections = await Collection.findAll({
      where: { userId },
      attributes: ["id", "name", "createdAt"],
    });

    return res.status(200).json({
      success: true,
      total: collections.length,
      data: collections,
    });
  } catch (error) {
    next(error);
  }
};

const getCollectionById = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;

    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
      include: [
        {
          model: Recipe,
          as: "recipes",
        },
      ],
    });

    if (!collection) {
      const err = new Error("Collection not found");
      err.statusCode = 404;
      return next(err);
    }

    return res.status(200).json({
      success: true,
      data: collection,
    });
  } catch (error) {
    next(error);
  }
};

const updateCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;
    const { name } = req.body;

    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      const err = new Error("Collection not found");
      err.statusCode = 404;
      return next(err);
    }

    if (name) collection.name = name;
    await collection.save();

    return res.status(200).json({
      success: true,
      message: "Collection updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId } = req.params;

    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      const err = new Error("Collection not found");
      err.statusCode = 404;
      return next(err);
    }

    await collection.destroy();

    return res.status(200).json({
      success: true,
      message: "Collection deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

const addRecipeToCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId, recipeId } = req.params;

    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      const err = new Error("Collection not found or not yours");
      err.statusCode = 404;
      return next(err);
    }

    await collection.addRecipe(recipeId);

    return res.status(201).json({
      success: true,
      message: "Recipe added to collection",
    });
  } catch (error) {
    next(error);
  }
};

const removeRecipeFromCollection = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const { collectionId, recipeId } = req.params;

    const collection = await Collection.findOne({
      where: { id: collectionId, userId },
    });

    if (!collection) {
      const err = new Error("Collection not found or not yours");
      err.statusCode = 404;
      return next(err);
    }

    await collection.removeRecipe(recipeId);

    return res.status(200).json({
      success: true,
      message: "Recipe removed from collection",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createCollection,
  getMyCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
};
