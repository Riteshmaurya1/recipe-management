// migrations/xxxx-create-collection-recipe.js
"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("CollectionRecipe", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      collectionId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Collection",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      recipeId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Recipe",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn("NOW"),
      },
    });

    await queryInterface.addConstraint("CollectionRecipe", {
      fields: ["collectionId", "recipeId"],
      type: "unique",
      name: "unique_collection_recipe",
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("CollectionRecipe");
  },
};
