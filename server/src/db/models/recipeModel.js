"use strict";

module.exports = (sequelize, DataTypes) => {
  const Recipe = sequelize.define(
    "Recipe",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      ingredients: {
        type: DataTypes.JSONB,
        allowNull: false,
      },

      instructions: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      cookingTime: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      servings: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      difficulty: {
        type: DataTypes.ENUM("easy", "medium", "hard"),
        defaultValue: "easy",
        allowNull: false,
      },

      imageUrl: {
        type: DataTypes.TEXT,
      },

      userId: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    {
      tableName: "Recipe",
      timestamps: true,
      paranoid: true,
    }
  );

  Recipe.associate = (models) => {
    Recipe.belongsTo(models.User, {
      foreignKey: "userId",
      as: "author",
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    });
  };

  return Recipe;
};
