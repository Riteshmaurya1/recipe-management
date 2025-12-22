"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Recipe", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: Sequelize.STRING,
        allowNull: false,
      },

      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      ingredients: {
        type: Sequelize.JSONB,
        allowNull: false,
        comment: "Array of ingredient strings",
      },

      instructions: {
        type: Sequelize.TEXT,
        allowNull: false,
      },

      cookingTime: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: "Cooking time in minutes",
      },

      servings: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },

      difficulty: {
        type: Sequelize.ENUM("easy", "medium", "hard"),
        defaultValue: "easy",
        allowNull: false,
      },

      imageUrl: {
        type: Sequelize.TEXT,
        allowNull: true,
      },

      category: {
        type: Sequelize.STRING,
      },

      dietaryTags: {
        type: Sequelize.ARRAY(Sequelize.STRING), // ["vegetarian", "vegan"]
      },

      isPublic: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
      },

      userId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "User",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.fn("NOW"),
      },
      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Recipe");
  },
};
