const express = require("express");
const router = express.Router();
const passport = require("passport"); // 1. Import passport

// Make sure your passport configuration file is executed here
require("../config/passport"); 
const authMiddleware = require("../middleware/authMiddleware");
const {
  register,
  login,
  refresh,
  logout,
  handleGoogleCallback,
  getMe,
  verifyEmail,
  resendVerification
} = require("../controllers/authController");

router.post("/register", register);
router.post("/login", login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", authMiddleware, getMe);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerification);




// --- Google OAuth Routes ---

// @desc    Trigger the Google OAuth Consent Screen
// @route   GET /api/v1/auth/google
router.get(
  "/google", 
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// @desc    Google OAuth Callback (Google redirects here after user signs in)
// @route   GET /api/auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  handleGoogleCallback
);

module.exports = router;