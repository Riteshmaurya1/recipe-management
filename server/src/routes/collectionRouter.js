// src/routes/collectionRoutes.js
const express = require("express");
const collectionRouter = express.Router();

const isAuth = require("../middleware/verifyJwt");
const {
  createCollection,
  getMyCollections,
  getCollectionById,
  updateCollection,
  deleteCollection,
  addRecipeToCollection,
  removeRecipeFromCollection,
} = require("../controller/collectionController");

// Collections CRUD
collectionRouter.post("/create", isAuth, createCollection);
collectionRouter.get("/all", isAuth, getMyCollections);
collectionRouter.get("/by/:collectionId", isAuth, getCollectionById);
collectionRouter.put("/update/:collectionId", isAuth, updateCollection);
collectionRouter.delete("/delete/:collectionId", isAuth, deleteCollection);

// Add/remove recipes in collection
collectionRouter.post(
  "/:collectionId/recipes/add/:recipeId",
  isAuth,
  addRecipeToCollection
);

collectionRouter.delete(
  "/:collectionId/recipes/remove/:recipeId",
  isAuth,
  removeRecipeFromCollection
);

module.exports = collectionRouter;
