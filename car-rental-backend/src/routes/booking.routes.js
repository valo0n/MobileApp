const express = require('express');
const router = express.Router();
const BookingViewModel = require('../viewmodels/Booking.viewmodel');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// GET /api/bookings
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await BookingViewModel.getByUser(req.userId, req.query.status);
    res.json({ success: true, data: bookings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/bookings/:id
router.get('/:id', authenticate, async (req, res) => {
  try {
    const booking = await BookingViewModel.getById(req.params.id);
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// POST /api/bookings
router.post('/', authenticate, async (req, res) => {
  try {
    const booking = await BookingViewModel.create(req.userId, req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// PUT /api/bookings/:id/cancel
router.put('/:id/cancel', authenticate, async (req, res) => {
  try {
    const result = await BookingViewModel.cancel(req.params.id, req.userId, req.body.reason);
    res.json({ success: true, data: result });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

// PUT /api/bookings/:id/status — Admin only
router.put('/:id/status', authenticate, authorize('admin'), async (req, res) => {
  try {
    const booking = await BookingViewModel.updateStatus(req.params.id, req.body.status);
    res.json({ success: true, data: booking });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
});

module.exports = router;
