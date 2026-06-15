const express = require("express");
const router = express.Router();
const AuthViewModel = require("../viewmodels/Auth.viewmodel");
const { authenticate } = require("../middleware/auth.middleware");

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const result = await AuthViewModel.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const result = await AuthViewModel.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/refresh
router.post("/refresh", async (req, res) => {
  try {
    const result = await AuthViewModel.refresh(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/logout
router.post("/logout", async (req, res) => {
  try {
    const result = await AuthViewModel.logout(req.body.refreshToken);
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/forgot-password
router.post("/forgot-password", async (req, res) => {
  try {
    const result = await AuthViewModel.requestPasswordReset(req.body.email);
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/reset-password
router.post("/reset-password", async (req, res) => {
  try {
    const { email, code, password } = req.body;
    const result = await AuthViewModel.resetPassword(email, code, password);
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/send-verification
router.post("/send-verification", async (req, res) => {
  try {
    const result = await AuthViewModel.sendEmailVerification(req.body.email);
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/auth/verify-email
router.post("/verify-email", async (req, res) => {
  try {
    const result = await AuthViewModel.verifyEmail(
      req.body.email,
      req.body.code,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// GET /api/auth/profile
router.get("/profile", authenticate, async (req, res) => {
  try {
    const user = await AuthViewModel.getProfile(req.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

module.exports = router;
