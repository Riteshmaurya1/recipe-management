const { body, validationResult } = require("express-validator");

const validateSignup = [
  body("username")
    .trim()
    .notEmpty()
    .withMessage("username is required")
    .withMessage("username must be at least 1 characters"),

  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .withMessage("Name must be at least 2 characters"),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("phoneNumber")
    .notEmpty()
    .withMessage("Phone number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Phone number must be 10 digits")
    .isNumeric()
    .withMessage("Phone number must contain only numbers"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // final middleware to check errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // error's send to globalErrorHandler
      const error = new Error(
        errors
          .array()
          .map((e) => e.msg)
          .join(", ")
      );
      error.statusCode = 400;
      return next(error);
    }
    next();
  },
];

const validateSignIn = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Please provide a valid email"),

  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),

  // final middleware to check errors
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // error's send to globalErrorHandler
      const error = new Error(
        errors
          .array()
          .map((e) => e.msg)
          .join(", ")
      );
      error.statusCode = 400;
      return next(error);
    }
    next();
  },
];

module.exports = {
  validateSignup,
  validateSignIn,
};
