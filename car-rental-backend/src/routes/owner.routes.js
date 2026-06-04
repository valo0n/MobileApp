// ============================================================
// Owner Routes — /api/owners
// ============================================================

const express = require("express");
const router = express.Router();
const OwnerViewModel = require("../viewmodels/Owner.viewmodel");
const { authenticate } = require("../middleware/auth.middleware");

// GET /api/owners/me — a osht user-i car owner (null nese jo)
router.get("/me", authenticate, async (req, res) => {
  try {
    const owner = await OwnerViewModel.getMyOwner(req.userId);
    res.json({ success: true, data: owner });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

// POST /api/owners/register — behu partner / car owner + krijo veturen
router.post("/register", authenticate, async (req, res) => {
  try {
    const result = await OwnerViewModel.becomePartner(req.userId, req.body);
    res.status(201).json({ success: true, data: result });
  } catch (error) {
    res
      .status(error.status || 500)
      .json({ success: false, message: error.message });
  }
});

module.exports = router;
