require("dotenv").config({ path: `${process.cwd()}/.env`, quiet: true });
const express = require("express");
const app = express();
const PORT = process.env.PORT || 4000;
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const db = require("./src/config/db-connection");
const cookieParser = require("cookie-parser");
const globalErrorHandler = require("./src/middleware/globalErrorHandler");
const authRoutes = require("./src/routes/authRouter");
const profileRoutes = require("./src/routes/profileRouter");
const recipeRoutes = require("./src/routes/recipeRouter");
const favoriteRoutes = require("./src/routes/favoriteRouter");
const collectionRoutes = require("./src/routes/collectionRouter");
const adminRoutes = require("./src/routes/adminRouter");
const Sentry = require("@sentry/node");

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  tracesSampleRate: 1.0, // adjust lower in prod if needed
});

app.disable("x-powered-by");

// Middleware
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.CLIENT_URL || "http://127.0.0.1:5500",
      "http://localhost:5500",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options(/(.*)/, cors());

app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  })
);

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
// app.use("/api/v1/follow", followRoutes); //Completed ✔ inside the profile router.
// app.use("/api/v1/feed", feedRoutes); //Completed ✔ inside the profile router.
app.use("/api/v1/admin", adminRoutes); //Completed ✔

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
