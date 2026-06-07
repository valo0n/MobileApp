const express = require("express");
const { authenticate, authorize } = require("../middleware/auth.middleware");
const {
  PaymentModel,
  ReviewModel,
  ConversationModel,
  MessageModel,
  NotificationModel,
  FavoriteModel,
  PromotionModel,
} = require("../models/index");
const BookingModel = require("../models/Booking.model");

// Stripe (init i sigurt: nuk e rrezon serverin nese mungon pako/key)
let stripe = null;
try {
  if (process.env.STRIPE_SECRET_KEY) {
    stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
  }
} catch (e) {
  console.warn("Stripe not available:", e.message);
}

// ============================================================
// PAYMENT ROUTES
// ============================================================
const paymentRouter = express.Router();

paymentRouter.get("/booking/:bookingId", authenticate, async (req, res) => {
  try {
    const payments = await PaymentModel.findByBooking(req.params.bookingId);
    res.json({ success: true, data: payments });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

paymentRouter.post("/", authenticate, async (req, res) => {
  try {
    const payment = await PaymentModel.create(req.body);
    res.status(201).json({ success: true, data: payment });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Krijo nje Stripe Checkout Session per nje booking
paymentRouter.post("/checkout", authenticate, async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ success: false, message: "Stripe is not configured" });
    }
    const booking = await BookingModel.findById(req.body.booking_id);
    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: (booking.currency || "usd").toLowerCase(),
            product_data: {
              name: `QENT car rental — ${booking.booking_ref}`,
            },
            unit_amount: Math.round(Number(booking.total_price) * 100),
          },
          quantity: 1,
        },
      ],
      success_url:
        "https://example.com/success?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: "https://example.com/cancel",
      metadata: {
        booking_id: String(booking.id),
        user_id: String(req.userId),
      },
    });

    res.json({
      success: true,
      data: { url: session.url, sessionId: session.id },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Konfirmo pagesen pas kthimit nga Stripe
paymentRouter.post("/confirm", authenticate, async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ success: false, message: "Stripe is not configured" });
    }
    const session = await stripe.checkout.sessions.retrieve(
      req.body.session_id,
    );

    if (session.payment_status === "paid") {
      const bookingId = session.metadata.booking_id;
      await PaymentModel.create({
        booking_id: bookingId,
        amount: session.amount_total / 100,
        currency: (session.currency || "usd").toUpperCase(),
        status: "completed",
        transaction_id: session.payment_intent,
        payment_date: new Date(),
      });
      await BookingModel.update(bookingId, { status: "confirmed" });
      return res.json({
        success: true,
        data: { paid: true, booking_id: bookingId },
      });
    }

    res.json({
      success: true,
      data: { paid: false, status: session.payment_status },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── PaymentSheet/CardField: krijo PaymentIntent vetem me shumen ──
paymentRouter.post("/intent", authenticate, async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ success: false, message: "Stripe is not configured" });
    }
    const amount = Number(req.body.amount);
    if (!amount || amount <= 0) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid amount" });
    }
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: (req.body.currency || "usd").toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: { user_id: String(req.userId) },
    });
    res.json({
      success: true,
      data: {
        clientSecret: intent.client_secret,
        paymentIntentId: intent.id,
      },
    });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Konfirmo PaymentIntent (regjistro pagesen + booking confirmed) ──
paymentRouter.post("/intent/confirm", authenticate, async (req, res) => {
  try {
    if (!stripe) {
      return res
        .status(500)
        .json({ success: false, message: "Stripe is not configured" });
    }
    const intent = await stripe.paymentIntents.retrieve(
      req.body.payment_intent_id,
    );
    if (intent.status === "succeeded") {
      const bookingId = intent.metadata.booking_id;
      await PaymentModel.create({
        booking_id: bookingId,
        amount: intent.amount / 100,
        currency: (intent.currency || "usd").toUpperCase(),
        status: "completed",
        transaction_id: intent.id,
        payment_date: new Date(),
      });
      await BookingModel.update(bookingId, { status: "confirmed" });
      return res.json({ success: true, data: { paid: true } });
    }
    res.json({ success: true, data: { paid: false, status: intent.status } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================================
// REVIEW ROUTES
// ============================================================
const reviewRouter = express.Router();

reviewRouter.get("/car/:carId", async (req, res) => {
  try {
    const reviews = await ReviewModel.findByCar(req.params.carId);
    const stats = await ReviewModel.getAverageRating(req.params.carId);
    res.json({ success: true, data: { reviews, stats } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

reviewRouter.post("/", authenticate, async (req, res) => {
  try {
    const review = await ReviewModel.create({
      ...req.body,
      reviewer_id: req.userId,
    });
    res.status(201).json({ success: true, data: review });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================================
// CHAT ROUTES (basic text only)
// ============================================================
const chatRouter = express.Router();

chatRouter.get("/conversations", authenticate, async (req, res) => {
  try {
    const conversations = await ConversationModel.findByUser(req.userId);
    res.json({ success: true, data: conversations });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

chatRouter.get(
  "/conversations/:id/messages",
  authenticate,
  async (req, res) => {
    try {
      const messages = await MessageModel.findByConversation(req.params.id);
      res.json({ success: true, data: messages });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
);

chatRouter.post(
  "/conversations/:id/messages",
  authenticate,
  async (req, res) => {
    try {
      const message = await MessageModel.create({
        conversation_id: req.params.id,
        sender_id: req.userId,
        content: req.body.content,
        message_type: "text",
      });
      // Update conversation timestamp
      await ConversationModel.update(req.params.id, { updated_at: new Date() });
      res.status(201).json({ success: true, data: message });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
);

// Krijo ose merr nje bisede me nje user (recipient_id)
chatRouter.post("/conversations/start", authenticate, async (req, res) => {
  try {
    const otherUserId = req.body.recipient_id;
    if (!otherUserId) {
      return res
        .status(400)
        .json({ success: false, message: "Recipient not found" });
    }
    if (Number(otherUserId) === Number(req.userId)) {
      return res
        .status(400)
        .json({ success: false, message: "You cannot chat with yourself" });
    }

    const id = await ConversationModel.findOrCreateBetween(
      req.userId,
      otherUserId,
    );
    res.status(201).json({ success: true, data: { id } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Shenoji mesazhet e bisedes si te lexuara
chatRouter.put("/conversations/:id/read", authenticate, async (req, res) => {
  try {
    await ConversationModel.markRead(req.params.id, req.userId);
    res.json({ success: true, message: "Marked as read" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================================
// NOTIFICATION ROUTES
// ============================================================
const notificationRouter = express.Router();

notificationRouter.get("/", authenticate, async (req, res) => {
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

notificationRouter.put("/read-all", authenticate, async (req, res) => {
  try {
    await NotificationModel.markAllRead(req.userId);
    res.json({ success: true, message: "All notifications marked as read" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================================
// FAVORITE ROUTES
// ============================================================
const favoriteRouter = express.Router();

favoriteRouter.get("/", authenticate, async (req, res) => {
  try {
    const favorites = await FavoriteModel.findByUser(req.userId);
    res.json({ success: true, data: favorites });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

favoriteRouter.post("/toggle", authenticate, async (req, res) => {
  try {
    const result = await FavoriteModel.toggle(req.userId, req.body.car_id);
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ============================================================
// PROMOTION ROUTES
// ============================================================
const promotionRouter = express.Router();

promotionRouter.get("/", async (req, res) => {
  try {
    const promos = await PromotionModel.findAll({ is_active: true });
    res.json({ success: true, data: promos });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

promotionRouter.post("/validate", authenticate, async (req, res) => {
  try {
    const promo = await PromotionModel.findActiveByCode(req.body.code);
    if (!promo)
      return res
        .status(404)
        .json({ success: false, message: "Invalid or expired code" });
    res.json({ success: true, data: promo });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

promotionRouter.post(
  "/",
  authenticate,
  authorize("admin"),
  async (req, res) => {
    try {
      const promo = await PromotionModel.create(req.body);
      res.status(201).json({ success: true, data: promo });
    } catch (e) {
      res.status(500).json({ success: false, message: e.message });
    }
  },
);

module.exports = {
  paymentRouter,
  reviewRouter,
  chatRouter,
  notificationRouter,
  favoriteRouter,
  promotionRouter,
};
