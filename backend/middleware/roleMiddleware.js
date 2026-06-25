const mongoose = require("mongoose");
const Role = require("../models/Role");

const ROLE_ORDER = {
  Candidate: 1,
  Recruiter: 2,
  Admin: 3
};

const normalizeRoleName = (roleName) => {
  if (!roleName) {
    return null;
  }

  const normalized = String(roleName).trim();

  if (!normalized) {
    return null;
  }

  return normalized.charAt(0).toUpperCase() + normalized.slice(1).toLowerCase();
};

const normalizeRoleList = (roles = []) => {
  return [...new Set(
    roles
      .map(normalizeRoleName)
      .filter(Boolean)
  )];
};

const authorizeRoles = (...allowedRoles) => {
  const normalizedAllowedRoles = normalizeRoleList(allowedRoles);

  return (req, res, next) => {
    const userRoleName = normalizeRoleName(req.user?.roleName);

    if (!userRoleName) {
      return res.status(401).json({
        message: "Access denied"
      });
    }

    if (userRoleName === "Admin") {
      return next();
    }

    if (!normalizedAllowedRoles.includes(userRoleName)) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return next();
  };
};

const authorizeMinimumRole = (minimumRole) => {
  const normalizedMinimumRole = normalizeRoleName(minimumRole);
  const minimumRank = ROLE_ORDER[normalizedMinimumRole];

  return (req, res, next) => {
    const userRoleName = normalizeRoleName(req.user?.roleName);
    const userRank = ROLE_ORDER[userRoleName];

    if (!userRoleName || !userRank || !minimumRank) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    if (userRoleName === "Admin") {
      return next();
    }

    if (userRank < minimumRank) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return next();
  };
};

const authorizePermissions = (...requiredPermissions) => {
  const normalizedPermissions = [...new Set(requiredPermissions.filter(Boolean))];

  return async (req, res, next) => {
    const userRoleName = normalizeRoleName(req.user?.roleName);

    if (!userRoleName) {
      return res.status(401).json({
        message: "Access denied"
      });
    }

    if (userRoleName === "Admin" || normalizedPermissions.length === 0) {
      return next();
    }

    const roleQuery = req.user?.roleId && mongoose.Types.ObjectId.isValid(req.user.roleId)
      ? { _id: req.user.roleId }
      : { name: userRoleName };

    const role = await Role.findOne(roleQuery).select("permissions name");

    if (!role) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    const rolePermissions = Array.isArray(role.permissions) ? role.permissions : [];
    const hasAllPermissions = normalizedPermissions.every((permission) => rolePermissions.includes(permission));

    if (!hasAllPermissions) {
      return res.status(403).json({
        message: "Forbidden"
      });
    }

    return next();
  };
};

module.exports = {
  authorizeRoles,
  authorizeMinimumRole,
  authorizePermissions
};