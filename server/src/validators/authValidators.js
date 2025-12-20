const { body, validationResult } = require("express-validator");

const validateSignup = [
  body("username")
    .trim()
    .notEmpty()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can contain only letters, numbers and underscore"),

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

const updateProfileValidator = [
  body("name")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters"),

  body("username")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ min: 3 })
    .withMessage("Username must be at least 3 characters")
    .matches(/^[a-zA-Z0-9_]+$/)
    .withMessage("Username can contain only letters, numbers and underscore"),

  body("phoneNumber")
    .optional({ checkFalsy: true })
    .trim()
    .isMobilePhone("any")
    .withMessage("Invalid phone number"),

  body("password")
    .optional({ checkFalsy: true })
    .isStrongPassword({
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,
      minSymbols: 0,
    })
    .withMessage(
      "Password must be at least 8 characters and include uppercase, lowercase and a number"
    ),

  // Final error handler (same pattern you use everywhere)
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error(
        errors
          .array()
          .map((err) => err.msg)
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
  updateProfileValidator,
};
