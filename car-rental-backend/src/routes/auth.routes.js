const express = require('express');
const router = express.Router();
const AuthViewModel = require('../viewmodels/Auth.viewmodel');
const { authenticate } = require('../middleware/auth.middleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const result = await AuthViewModel.register(req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const result = await AuthViewModel.login(req.body);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// GET /api/auth/profile
router.get('/profile', authenticate, async (req, res) => {
  try {
    const user = await AuthViewModel.getProfile(req.userId);
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

module.exports = router;
