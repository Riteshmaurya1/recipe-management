const express = require("express");
const profileRouter = express.Router();
const isAuth = require("../middleware/verifyJwt");
const { getProfile, updateProfile } = require("../controller/userController");
const feedRouter = require("./feedRouter");
const followRouter = require("./followRouter");

// Profile Routes.
profileRouter.get("/profile", isAuth, getProfile);
profileRouter.put("/profile", isAuth, updateProfile);

// Profile Routes with followRouter under /profile/follow
profileRouter.use("/profile/follow", followRouter);

// Profile feed
profileRouter.use("/profile/feed", feedRouter);

module.exports = profileRouter;
