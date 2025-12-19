const signup = async (req, res, next) => {
  try {
    // get data from request body.
    const { name, email, password } = req.body;

    // Check all data is passed or not
    if (!name && !email && !password) {
      const error = new Error("Missing Credentials");
      error.statusCode = 400;
      return next(error);
    }

    // return response
    return res.status(201).json({
      success: true,
      message: "User sign up successfully",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  signup,
};
