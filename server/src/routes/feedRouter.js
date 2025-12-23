const express = require("express");
const feedRouter = express.Router();

const isAuth = require("../middleware/verifyJwt");
const { getMyFeed } = require("../controller/feedController");

// GET /api/v1/feed
feedRouter.get("/", isAuth, getMyFeed);

module.exports = feedRouter;
