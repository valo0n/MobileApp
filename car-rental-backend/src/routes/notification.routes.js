const express = require("express");
const router = express.Router();
const { authenticate } = require("../middleware/auth.middleware");
const { NotificationModel } = require("../models/index");

// GET /api/notifications — te gjitha ose vetem te palexuara
router.get("/", authenticate, async (req, res) => {
  try {
    const notifications = await NotificationModel.findByUser(
      req.userId,
      req.query.unread === "true",
    );
    res.json({ success: true, data: notifications });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// GET /api/notifications/count — numri i njoftimeve te palexuara
router.get("/count", authenticate, async (req, res) => {
  try {
    const rows = await NotificationModel.rawQuery(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = FALSE`,
      [req.userId],
    );
    res.json({ success: true, data: { count: rows[0]?.count || 0 } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// PUT /api/notifications/read-all — shenoji te gjitha si te lexuara
router.put("/read-all", authenticate, async (req, res) => {
  try {
    await NotificationModel.markAllRead(req.userId);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// DELETE /api/notifications/:id — fshij nje njoftim
router.delete("/:id", authenticate, async (req, res) => {
  try {
    const notif = await NotificationModel.findById(req.params.id);
    if (!notif || notif.user_id !== req.userId) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    await NotificationModel.delete(req.params.id);
    res.json({ success: true, message: "Deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = router;
