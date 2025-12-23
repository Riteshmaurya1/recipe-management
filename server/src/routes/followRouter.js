const express = require("express");
const followRouter = express.Router();

const isAuth = require("../middleware/verifyJwt");
const {
  followUser,
  unfollowUser,
  getMyFollowers,
  getMyFollowing,
} = require("../controller/followController");

// Follow a user
followRouter.post("/:userId", isAuth, followUser);

// Unfollow a user
followRouter.delete("/:userId", isAuth, unfollowUser);

// Get list of users I follow
followRouter.get("/following/me", isAuth, getMyFollowing);

// Get list of my followers
followRouter.get("/followers/me", isAuth, getMyFollowers);

module.exports = followRouter;
