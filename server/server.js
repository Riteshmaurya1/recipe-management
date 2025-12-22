require("dotenv").config({ path: `${process.cwd()}/.env`, quiet: true });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const db = require("./src/config/db-connection");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./src/middleware/globalErrorHandler");
const authRoutes = require("./src/routes/authRouter");
const profileRoutes = require("./src/routes/profileRouter");
const recipeRoutes = require("./src/routes/recipeRouter");
const favoriteRoutes = require("./src/routes/favoriteRouter");
const collectionRoutes = require("./src/routes/collectionRouter");

// Middleware
app.use(express.json());
app.use(cookieParser());

// Server confirmation Route
app.get("/", (req, res) => {
  res.json({ message: "Server is running!" });
});

// Custom Routes
app.use("/api/v1/auth", authRoutes); //Completed ✔
app.use("/api/v1/user", profileRoutes); //Completed ✔
app.use("/api/v1/recipes", recipeRoutes); //Completed ✔
app.use("/api/v1/favorites", favoriteRoutes); //Completed ✔
app.use("/api/v1/collections", collectionRoutes); //Completed ✔

// Invalid routes
app.use(/(.*)/, (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

// Global Error Handler
app.use(globalErrorHandler);

// Run Server
(async () => {
  try {
    db.connectDB();
    app.listen(PORT, () => {
      console.log(`🚀 Server is running ${PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
})();
