const crypto = require("crypto");
const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.JWT_SECRET || "hireloop-dev-access-secret";
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET || "hireloop-dev-refresh-secret";
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const buildTokenPayload = (user) => {
  const roleId = user.roleId && typeof user.roleId === "object"
    ? user.roleId._id
    : user.roleId;

  const roleName = user.roleId && typeof user.roleId === "object"
    ? user.roleId.name
    : user.roleName;

  return {
    userId: user._id.toString(),
    email: user.email,
    roleId: roleId ? roleId.toString() : null,
    roleName,
    companyId: user.companyId ? user.companyId.toString() : null
  };
};

const generateAccessToken = (user) => jwt.sign(
  buildTokenPayload(user),
  ACCESS_TOKEN_SECRET,
  {
    expiresIn: "15m"
  }
);

const generateRefreshToken = (user) => jwt.sign(
  buildTokenPayload(user),
  REFRESH_TOKEN_SECRET,
  {
    expiresIn: "7d"
  }
);

const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_TOKEN_SECRET);

const hashToken = (token) => crypto.createHash("sha256").update(token).digest("hex");

const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  path: "/api/auth",
  maxAge: REFRESH_TOKEN_TTL_MS
});

module.exports = {
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshCookieOptions
};