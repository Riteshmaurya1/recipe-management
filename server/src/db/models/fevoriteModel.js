// db/models/favorite.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Favorite = sequelize.define(
    "Favorite",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: "Favorite",
    }
  );

  Favorite.associate = (models) => {
    Favorite.belongsTo(models.User, { foreignKey: "userId", as: "user" });
    Favorite.belongsTo(models.Recipe, { foreignKey: "recipeId", as: "recipe" });
  };

  return Favorite;
};
