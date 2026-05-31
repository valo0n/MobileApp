const express = require("express");
const router = express.Router();
const UserModel = require("../models/User.model");
const { authenticate, authorize } = require("../middleware/auth.middleware");

// GET /api/users — Admin only (te gjithe perdoruesit)
router.get("/", authenticate, authorize("admin"), async (req, res) => {
  try {
    const users = await UserModel.findAll();
    // Hek password_hash nga secili
    const safe = users.map(({ password_hash, ...u }) => u);
    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users/:id — nje perdorues
router.get("/:id", authenticate, async (req, res) => {
  try {
    const user = await UserModel.findWithRoles(req.params.id);
    if (!user)
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    const { password_hash, ...safe } = user;
    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id — perditeso profilin
router.put("/:id", authenticate, async (req, res) => {
  try {
    const roles = req.user?.roles || "";
    const isAdmin = roles.includes("admin");

    // Vetem vet user-i ose admin mund te perditesoje
    if (req.userId !== parseInt(req.params.id) && !isAdmin) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    // Mos lejo ndryshim te password ose email nga ketu
    const { password_hash, email, id, roles: _r, ...updateData } = req.body;

    await UserModel.update(req.params.id, updateData);

    const updated = await UserModel.findWithRoles(req.params.id);
    const { password_hash: _p, ...safe } = updated;

    res.json({ success: true, data: safe });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// DELETE /api/users/:id — Admin only (caktivizo)
router.delete("/:id", authenticate, authorize("admin"), async (req, res) => {
  try {
    await UserModel.update(req.params.id, { is_active: false });
    res.json({ success: true, message: "User deactivated" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
