const express = require("express");
const profileRouter = express.Router();
const isAuth = require("../middleware/verifyJwt");
const { getProfile,updateProfile } = require("../controller/userController");

profileRouter.get("/profile", isAuth, getProfile);
profileRouter.put("/profile", isAuth, updateProfile);

module.exports = profileRouter;
