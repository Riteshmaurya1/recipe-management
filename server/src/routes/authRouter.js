const express = require("express");
const authRouter = express.Router();
const { signup } = require("../controller/authController");
const { validateSignup } = require("../validators/authValidators");

authRouter.post("/signup", validateSignup, signup);

module.exports = authRouter;
