"use strict";

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      userType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "user",
        validate: {
          isIn: [["user", "admin"]],
        },
      },

      username: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
        set(value) {
          this.setDataValue("email", value.toLowerCase().trim());
        },
      },

      phoneNumber: {
        type: DataTypes.STRING(10),
        allowNull: false,
        validate: {
          isNumeric: true,
          len: [10, 10],
        },
      },

      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      refreshToken: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "User",
      paranoid: true,
      indexes: [
        {
          unique: true,
          fields: ["email", "userType"],
        },
      ],
      timestamps: true,
    }
  );
  User.associate = (models) => {
    User.hasMany(models.Favorite, { foreignKey: "userId", as: "favorites" });
    User.hasMany(models.Collection, {
      foreignKey: "userId",
      as: "collections",
    });
    User.hasMany(models.Review, { foreignKey: "userId", as: "reviews" });
    
    // Users that this user is following
    User.belongsToMany(models.User, {
      through: models.Follow,
      as: "Following",
      foreignKey: "followerId",
      otherKey: "followingId",
    });

    // Users that follow this user
    User.belongsToMany(models.User, {
      through: models.Follow,
      as: "Followers",
      foreignKey: "followingId",
      otherKey: "followerId",
    });
  };

  return User;
};
