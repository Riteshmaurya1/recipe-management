"use strict";
module.exports = (sequelize, DataTypes) => {
  const CollectionRecipe = sequelize.define(
    "CollectionRecipe",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
    },
    {
      tableName: "CollectionRecipe",
    }
  );

  return CollectionRecipe;
};
