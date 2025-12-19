const express = require("express");
const authRouter = express.Router();
const {
  signup,
  signin,
  refreshAccessToken,
} = require("../controller/authController");
const {
  validateSignup,
  validateSignIn,
} = require("../validators/authValidators");
const isAuth = require("../middleware/verifyJwt");

authRouter.post("/signup", validateSignup, signup);
authRouter.post("/signin", validateSignIn, signin);
authRouter.post("/refresh", refreshAccessToken);

module.exports = authRouter;
