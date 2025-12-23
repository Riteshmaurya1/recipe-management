const isAdmin = (req, res, next) => {
  try {
    const user = req.user; // from verifyJwt

    if (!user || user.userType !== "admin") {
      const err = new Error("Admin access required");
      err.statusCode = 403;
      return next(err);
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = isAdmin;
