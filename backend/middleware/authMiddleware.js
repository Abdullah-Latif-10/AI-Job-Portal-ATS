const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { ACCESS_TOKEN_SECRET } = require("../utils/authTokens");

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const cookieToken = req.cookies?.accessToken;
  const bearerToken = authHeader && authHeader.startsWith("Bearer ")
    ? authHeader.split(" ")[1]
    : null;
  const token = bearerToken || cookieToken;

  if (!token) {
    return res.status(401).json({
      message: "Access denied"
    });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded.userId).select("isActive");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    if (user.isActive === false) {
      return res.status(403).json({ message: "Your account has been suspended. Contact support." });
    }

    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid token"
    });
  }
};

module.exports = authMiddleware;
