const { body, validationResult } = require("express-validator");

const validateSignup = [
  body("firstName")
    .trim()
    .notEmpty()
    .withMessage("First Name is required")
    .withMessage("First Name must be at least 1 characters"),

  body("lastName")
    .trim()
    .notEmpty()
    .withMessage("Last Name is required")
    .withMessage("Last Name must be at least 1 characters"),

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

module.exports = { validateSignup };
