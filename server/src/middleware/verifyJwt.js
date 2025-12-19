const jwt = require("jsonwebtoken");
const { User } = require("../db/models");

const isAuth = async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    const err = new Error("Invalid token");
    err.statusCode = 401;
    return next(err);
  }

  const token = authorization.split(" ")[1];
  if (!token) {
    const err = new Error("Unauthorized");
    err.statusCode = 401;
    return next(err);
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findByPk(decoded.id);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 400;
      return next(err);
    }

    req.payload = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      error.statusCode = 401;
      error.message = "jwt expired";
    } else if (error.name === "JsonWebTokenError") {
      error.statusCode = 401;
      error.message = "invalid token";
    }
    next(error);
  }
};

module.exports = isAuth;
