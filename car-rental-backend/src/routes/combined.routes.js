const express = require('express');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const {
  PaymentModel, ReviewModel, ConversationModel,
  MessageModel, NotificationModel, FavoriteModel, PromotionModel,
} = require('../models/index');

// ============================================================
// PAYMENT ROUTES
// ============================================================
const paymentRouter = express.Router();

paymentRouter.get('/booking/:bookingId', authenticate, async (req, res) => {
  try {
    const payments = await PaymentModel.findByBooking(req.params.bookingId);
    res.json({ success: true, data: payments });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

paymentRouter.post('/', authenticate, async (req, res) => {
  try {
    const payment = await PaymentModel.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============================================================
// REVIEW ROUTES
// ============================================================
const reviewRouter = express.Router();

reviewRouter.get('/car/:carId', async (req, res) => {
  try {
    const reviews = await ReviewModel.findByCar(req.params.carId);
    const stats = await ReviewModel.getAverageRating(req.params.carId);
    res.json({ success: true, data: { reviews, stats } });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

reviewRouter.post('/', authenticate, async (req, res) => {
  try {
    const review = await ReviewModel.create({ ...req.body, reviewer_id: req.userId });
    res.status(201).json({ success: true, data: review });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============================================================
// CHAT ROUTES (basic text only)
// ============================================================
const chatRouter = express.Router();

chatRouter.get('/conversations', authenticate, async (req, res) => {
  try {
    const conversations = await ConversationModel.findByUser(req.userId);
    res.json({ success: true, data: conversations });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

chatRouter.get('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const messages = await MessageModel.findByConversation(req.params.id);
    res.json({ success: true, data: messages });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

chatRouter.post('/conversations/:id/messages', authenticate, async (req, res) => {
  try {
    const message = await MessageModel.create({
      conversation_id: req.params.id,
      sender_id: req.userId,
      content: req.body.content,
      message_type: 'text',
    });
    // Update conversation timestamp
    await ConversationModel.update(req.params.id, { updated_at: new Date() });
    res.status(201).json({ success: true, data: message });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============================================================
// NOTIFICATION ROUTES
// ============================================================
const notificationRouter = express.Router();

notificationRouter.get('/', authenticate, async (req, res) => {
  try {
    const notifications = await NotificationModel.findByUser(req.userId, req.query.unread === 'true');
    res.json({ success: true, data: notifications });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

notificationRouter.put('/read-all', authenticate, async (req, res) => {
  try {
    await NotificationModel.markAllRead(req.userId);
    res.json({ success: true, message: 'All notifications marked as read' });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============================================================
// FAVORITE ROUTES
// ============================================================
const favoriteRouter = express.Router();

favoriteRouter.get('/', authenticate, async (req, res) => {
  try {
    const favorites = await FavoriteModel.findByUser(req.userId);
    res.json({ success: true, data: favorites });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

favoriteRouter.post('/toggle', authenticate, async (req, res) => {
  try {
    const result = await FavoriteModel.toggle(req.userId, req.body.car_id);
    res.json({ success: true, data: result });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

// ============================================================
// PROMOTION ROUTES
// ============================================================
const promotionRouter = express.Router();

promotionRouter.get('/', async (req, res) => {
  try {
    const promos = await PromotionModel.findAll({ is_active: true });
    res.json({ success: true, data: promos });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

promotionRouter.post('/validate', authenticate, async (req, res) => {
  try {
    const promo = await PromotionModel.findActiveByCode(req.body.code);
    if (!promo) return res.status(404).json({ success: false, message: 'Invalid or expired code' });
    res.json({ success: true, data: promo });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

promotionRouter.post('/', authenticate, authorize('admin'), async (req, res) => {
  try {
    const promo = await PromotionModel.create(req.body);
    res.status(201).json({ success: true, data: promo });
  } catch (e) { res.status(500).json({ success: false, message: e.message }); }
});

module.exports = {
  paymentRouter,
  reviewRouter,
  chatRouter,
  notificationRouter,
  favoriteRouter,
  promotionRouter,
};
