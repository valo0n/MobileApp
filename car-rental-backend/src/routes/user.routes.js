const express = require('express');
const router = express.Router();
const UserModel = require('../models/User.model');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/users — Admin only
router.get('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const users = await UserModel.findAll();
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const user = await UserModel.findWithRoles(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const { password_hash, ...safe } = user;
    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id
router.put('/:id', authenticate, async (req, res) => {
  try {
    if (req.userId !== parseInt(req.params.id) && !req.user.roles.includes('admin')) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }
    const { password_hash, email, ...updateData } = req.body;
    await UserModel.update(req.params.id, updateData);
    const updated = await UserModel.findById(req.params.id);
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/users/:id — Admin only
router.delete('/:id', authenticate, authorize('admin'), async (req, res) => {
  try {
    await UserModel.update(req.params.id, { is_active: false });
    res.json({ success: true, message: 'User deactivated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
