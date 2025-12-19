const express = require("express");
const authRouter = express.Router();
const { signup, signin } = require("../controller/authController");
const {
  validateSignup,
  validateSignIn,
} = require("../validators/authValidators");

authRouter.post("/signup", validateSignup, signup);
authRouter.post("/signin", validateSignIn, signin);

module.exports = authRouter;
