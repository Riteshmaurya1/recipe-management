"use strict";
module.exports = (sequelize, DataTypes) => {
  const Collection = sequelize.define(
    "Collection",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      tableName: "Collection",
    }
  );

  Collection.associate = (models) => {
    Collection.belongsTo(models.User, { foreignKey: "userId", as: "owner" });

    Collection.belongsToMany(models.Recipe, {
      through: "CollectionRecipe",
      foreignKey: "collectionId",
      otherKey: "recipeId",
      as: "recipes",
    });
  };

  return Collection;
};
