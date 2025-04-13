const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, "superSecret123");

      req.user = await User.findById(decoded.id).select("-password");

      console.log("Authenticated user:", req.user); // 👈 Add this

      next();
    } catch (error) {
      console.error("JWT verification failed:", error); // 👈 Add this
      res.status(401);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    console.error("No token provided in header"); // 👈 Add this
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect };
