const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "hireloop-dev-secret";

const generateToken = (user) => {
  const roleName = user.roleId && typeof user.roleId === "object"
    ? user.roleId.name
    : user.roleName;

  return jwt.sign(
    {
      userId: user._id,
      email: user.email,
      roleId: user.roleId && typeof user.roleId === "object"
        ? user.roleId._id
        : user.roleId,
      roleName,
      companyId: user.companyId
    },
    JWT_SECRET,
    {
      expiresIn: "7d"
    }
  );
};

module.exports = generateToken;