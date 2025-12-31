const { logErrorToFile } = require("../log/fileLogger");
const globalErrorHandler = (err, req, res, next) => {
  const statusCode = err.statusCode || err.status || 500;
  const isProd = process.env.NODE_ENV === "production";
  logErrorToFile(err, req);
  res.status(statusCode).json({
    error: isProd ? "Something went wrong" : err.message,
  });
};

module.exports = globalErrorHandler;
