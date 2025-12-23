const { Follow, User } = require("../db/models");

// POST /api/v1/follow/:userId
const followUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    if (followerId === followingId) {
      const err = new Error("You cannot follow yourself");
      err.statusCode = 400;
      return next(err);
    }

    const [relation, created] = await Follow.findOrCreate({
      where: { followerId, followingId },
    });

    // Fetch followed user's name for the message
    const followedUser = await User.findByPk(followingId, {
      attributes: ["id", "name"],
    });

    const followedName = followedUser ? followedUser.name : "this user";

    if (!created) {
      return res.status(200).json({
        success: true,
        message: `Already following ${followedName}`,
      });
    }

    return res.status(201).json({
      success: true,
      message: `Now following ${followedName}`,
    });
  } catch (error) {
    next(error);
  }
};
// DELETE /api/v1/follow/:userId
const unfollowUser = async (req, res, next) => {
  try {
    const followerId = req.user.id;
    const { userId: followingId } = req.params;

    await Follow.destroy({
      where: { followerId, followingId },
    });

    return res.status(200).json({
      success: true,
      message: "Unfollowed user successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/follow/following/me
const getMyFollowing = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const rows = await Follow.findAll({
      where: { followerId: userId },
      include: [
        {
          model: User,
          as: "following",
          attributes: ["id", "name", "email"], // adjust to your fields
        },
      ],
    });

    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/follow/followers/me
const getMyFollowers = async (req, res, next) => {
  try {
    const userId = req.user.id;

    const rows = await Follow.findAll({
      where: { followingId: userId },
      include: [
        {
          model: User,
          as: "follower",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    return res.status(200).json({
      success: true,
      total: rows.length,
      data: rows,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  followUser,
  unfollowUser,
  getMyFollowing,
  getMyFollowers,
};
