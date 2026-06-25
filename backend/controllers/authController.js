const mongoose = require("mongoose");
const User = require("../models/User");
const Role = require("../models/Role");
const RefreshToken = require("../models/RefreshToken");
const bcrypt = require("bcryptjs");
const { sendVerificationEmail } = require("../utils/email");
const {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
  hashToken,
  getRefreshCookieOptions
} = require("../utils/authTokens");

const PUBLIC_REGISTRATION_ROLES = new Set(["Candidate", "Recruiter"]);
const REFRESH_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const sanitizeUser = (user) => {
  const plainUser = user.toObject ? user.toObject() : user;
  delete plainUser.password;
  return plainUser;
};

const normalizeRoleName = (roleValue) => {
  if (!roleValue) {
    return "Candidate";
  }

  const value = String(roleValue).trim();

  if (!value) {
    return "Candidate";
  }

  return value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
};

const getOrCreateRoleByName = async (roleName) => {
  const normalizedRoleName = normalizeRoleName(roleName);

  if (!PUBLIC_REGISTRATION_ROLES.has(normalizedRoleName)) {
    return null;
  }

  const existingRole = await Role.findOne({ name: normalizedRoleName });

  if (existingRole) {
    return existingRole;
  }

  if (!["Candidate", "Recruiter", "Admin"].includes(normalizedRoleName)) {
    return null;
  }

  return Role.create({
    name: normalizedRoleName,
    permissions: []
  });
};

const resolveRole = async (role, roleId) => {
  if (roleId && mongoose.Types.ObjectId.isValid(roleId)) {
    const byId = await Role.findById(roleId);

    if (byId && PUBLIC_REGISTRATION_ROLES.has(byId.name)) {
      return byId;
    }
  }

  return getOrCreateRoleByName(role);
};

const populateUser = async (userId) => User.findById(userId).populate("roleId");

const clearRefreshCookie = (res) => {
  res.clearCookie("refreshToken", {
    path: "/api/auth"
  });
};

const storeRefreshToken = async (userId, refreshToken) => {
  return RefreshToken.create({
    userId,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL_MS)
  });
};

const issueAuthResponse = async (user, res) => {
  const populatedUser = await populateUser(user._id);

  if (!populatedUser) {
    throw new Error("User could not be loaded after creation");
  }

  const accessToken = generateAccessToken(populatedUser);
  const refreshToken = generateRefreshToken(populatedUser);

  await storeRefreshToken(populatedUser._id, refreshToken);
  res.cookie("refreshToken", refreshToken, getRefreshCookieOptions());

  return {
    accessToken,
    user: sanitizeUser(populatedUser)
  };
};

exports.register = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      email,
      password,
      role,
      roleId,
      companyId
    } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        message: "First name, last name, email, and password are required"
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });

    const resolvedRole = await resolveRole(role, roleId);

    if (!resolvedRole) {
      return res.status(400).json({
        message: "Valid role is required"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    const verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    if (existingUser) {
      if (!existingUser.isVerified) {
        // Update unverified user details and send a new OTP
        existingUser.firstName = firstName.trim();
        existingUser.lastName = lastName.trim();
        existingUser.password = hashedPassword;
        existingUser.roleId = resolvedRole._id;
        existingUser.companyId = companyId || null;
        existingUser.verificationCode = verificationCode;
        existingUser.verificationCodeExpires = verificationCodeExpires;

        await existingUser.save();
        await sendVerificationEmail(normalizedEmail, verificationCode);

        return res.status(201).json({
          message: "Registration updated. Please verify your email.",
          email: normalizedEmail,
          isVerified: false
        });
      }

      return res.status(409).json({
        message: "User already exists"
      });
    }

    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      roleId: resolvedRole._id,
      companyId: companyId || null,
      isVerified: false,
      verificationCode,
      verificationCodeExpires
    });

    await sendVerificationEmail(normalizedEmail, verificationCode);

    return res.status(201).json({
      message: "Registration successful. Please verify your email.",
      email: normalizedEmail,
      isVerified: false
    });
  } catch (error) {
    if (error && error.code === 11000) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    return res.status(500).json({
      message: "Registration failed"
    });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required"
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: normalizedEmail })
      .populate("roleId");

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid credentials"
      });
    }

    if (user.isActive === false) {
      return res.status(403).json({
        message: "Your account has been suspended. Contact support."
      });
    }

    // Check if email is verified
    if (!user.isVerified) {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      user.verificationCode = verificationCode;
      user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
      await user.save();

      await sendVerificationEmail(normalizedEmail, verificationCode);

      return res.status(403).json({
        message: "Email is not verified. A verification code has been sent.",
        email: normalizedEmail,
        isVerified: false
      });
    }

    const authResponse = await issueAuthResponse(user, res);

    return res.status(200).json({
      token: authResponse.accessToken,
      accessToken: authResponse.accessToken,
      user: authResponse.user
    });
  } catch (error) {
    return res.status(500).json({
      message: "Login failed"
    });
  }
};

exports.refresh = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (!incomingRefreshToken) {
      return res.status(401).json({
        message: "Refresh token required"
      });
    }

    let decoded;

    try {
      decoded = verifyRefreshToken(incomingRefreshToken);
    } catch (error) {
      clearRefreshCookie(res);
      return res.status(401).json({
        message: "Invalid refresh token"
      });
    }

    const tokenHash = hashToken(incomingRefreshToken);
    const storedToken = await RefreshToken.findOne({
      userId: decoded.userId,
      tokenHash,
      revokedAt: null
    });

    if (!storedToken || storedToken.expiresAt < new Date()) {
      clearRefreshCookie(res);
      return res.status(401).json({
        message: "Refresh token expired"
      });
    }

    const user = await populateUser(decoded.userId);

    if (!user) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      clearRefreshCookie(res);
      return res.status(401).json({
        message: "User not found"
      });
    }

    if (user.isActive === false) {
      await RefreshToken.deleteOne({ _id: storedToken._id });
      clearRefreshCookie(res);
      return res.status(403).json({
        message: "Your account has been suspended. Contact support."
      });
    }

    storedToken.revokedAt = new Date();
    await storedToken.save();

    const accessToken = generateAccessToken(user);
    const nextRefreshToken = generateRefreshToken(user);

    await storeRefreshToken(user._id, nextRefreshToken);
    res.cookie("refreshToken", nextRefreshToken, getRefreshCookieOptions());

    return res.status(200).json({
      token: accessToken,
      accessToken,
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Token refresh failed"
    });
  }
};

exports.logout = async (req, res) => {
  try {
    const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

    if (incomingRefreshToken) {
      await RefreshToken.findOneAndUpdate(
        { tokenHash: hashToken(incomingRefreshToken), revokedAt: null },
        { revokedAt: new Date() }
      );
    }

    clearRefreshCookie(res);

    return res.status(200).json({
      message: "Logged out"
    });
  } catch (error) {
    return res.status(500).json({
      message: "Logout failed"
    });
  }
};

exports.handleGoogleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect("http://localhost:5173/login?error=Google auth failed");
    }
    const authResponse = await issueAuthResponse(req.user, res);
    return res.redirect(`http://localhost:5173/oauth-success?token=${authResponse.accessToken}`);
  } catch (error) {
    console.error("Google auth callback failed:", error);
    return res.redirect("http://localhost:5173/login?error=Server error during Google auth");
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await populateUser(req.user.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }
    return res.status(200).json({
      user: sanitizeUser(user)
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch user profile"
    });
  }
};

exports.verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;
    if (!email || !code) {
      return res.status(400).json({ message: "Email and verification code are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail }).populate("roleId");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    if (user.verificationCode !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (user.verificationCodeExpires < new Date()) {
      return res.status(400).json({ message: "Verification code has expired" });
    }

    // Mark user as verified
    user.isVerified = true;
    user.verificationCode = null;
    user.verificationCodeExpires = null;
    await user.save();

    // Issue tokens
    const authResponse = await issueAuthResponse(user, res);

    return res.status(200).json({
      message: "Email successfully verified",
      token: authResponse.accessToken,
      accessToken: authResponse.accessToken,
      user: authResponse.user
    });

  } catch (error) {
    console.error("Verification error:", error);
    return res.status(500).json({ message: "Verification failed" });
  }
};

exports.resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.isVerified) {
      return res.status(400).json({ message: "Email is already verified" });
    }

    const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
    user.verificationCode = verificationCode;
    user.verificationCodeExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    await sendVerificationEmail(normalizedEmail, verificationCode);

    return res.status(200).json({ message: "Verification code resent successfully" });

  } catch (error) {
    console.error("Resend error:", error);
    return res.status(500).json({ message: "Failed to resend verification code" });
  }
};