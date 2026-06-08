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

// Per faturen PDF + verifikim token-i ne URL
const jwt = require("jsonwebtoken");
const config = require("../config/app");
let PDFDocument = null;
try {
  PDFDocument = require("pdfkit");
} catch (e) {
  console.warn("pdfkit not installed:", e.message);
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

// ── Saved payment methods (US-14) ──
paymentRouter.get("/methods", authenticate, async (req, res) => {
  try {
    const rows = await PaymentModel.rawQuery(
      `SELECT id, type, card_brand, last_four, expiry_month, expiry_year, holder_name, is_default
       FROM payment_methods WHERE user_id = ? ORDER BY created_at DESC`,
      [req.userId],
    );
    res.json({ success: true, data: rows });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

paymentRouter.post("/methods", authenticate, async (req, res) => {
  try {
    const b = req.body;
    const ins = await PaymentModel.rawQuery(
      `INSERT INTO payment_methods
        (user_id, type, card_brand, last_four, expiry_month, expiry_year, holder_name)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        req.userId,
        b.type || "credit_card",
        b.card_brand || null,
        b.last_four || null,
        b.expiry_month || null,
        b.expiry_year || null,
        b.holder_name || null,
      ],
    );
    res.status(201).json({ success: true, data: { id: ins.insertId } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

paymentRouter.delete("/methods/:id", authenticate, async (req, res) => {
  try {
    await PaymentModel.rawQuery(
      "DELETE FROM payment_methods WHERE id = ? AND user_id = ?",
      [req.params.id, req.userId],
    );
    res.json({ success: true, message: "Deleted" });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// ── Fatura PDF (US-15 / KF-07) — hapet ne browser me token ne URL ──
paymentRouter.get("/invoice/:bookingId", async (req, res) => {
  try {
    const token = req.query.token;
    if (!token) return res.status(401).send("No token");
    let userId;
    try {
      userId = jwt.verify(token, config.jwt.secret).userId;
    } catch (_) {
      return res.status(401).send("Invalid token");
    }
    if (!PDFDocument)
      return res.status(500).send("PDF generator not available");

    const b = await BookingModel.findWithDetails(req.params.bookingId);
    if (!b) return res.status(404).send("Booking not found");
    if (Number(b.user_id) !== Number(userId))
      return res.status(403).send("Not authorized");

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `inline; filename="invoice-${b.booking_ref}.pdf"`,
    );

    const doc = new PDFDocument({ size: "A4", margin: 50 });
    doc.pipe(res);

    doc.fontSize(24).fillColor("#111").text("QENT");
    doc.fontSize(10).fillColor("#666").text("Car Rental — Faturë");
    doc.moveDown();
    doc.fontSize(12).fillColor("#111");
    doc.text(`Numri i faturës: ${b.booking_ref}`);
    doc.text(`Data: ${new Date().toLocaleDateString()}`);
    doc.moveDown();

    doc.fontSize(13).fillColor("#111").text("Klienti", { underline: true });
    doc.fontSize(11).fillColor("#333");
    doc.text(`${b.first_name || ""} ${b.last_name || ""}`.trim());
    if (b.email) doc.text(b.email);
    if (b.phone) doc.text(b.phone);
    doc.moveDown();

    doc
      .fontSize(13)
      .fillColor("#111")
      .text("Detajet e qirasë", { underline: true });
    doc.fontSize(11).fillColor("#333");
    doc.text(`Makina: ${b.brand_name || ""} ${b.car_model || ""}`.trim());
    doc.text(`Marrja: ${b.pickup_datetime}`);
    doc.text(`Kthimi: ${b.dropoff_datetime}`);
    if (b.pickup_address) doc.text(`Lokacioni: ${b.pickup_address}`);
    doc.moveDown();

    const base = Number(b.base_price || 0);
    const fee = Number(b.service_fee || 0);
    const vat = Number(b.insurance_fee || 0);
    const total = Number(b.total_price || 0);
    doc.fontSize(13).fillColor("#111").text("Çmimi", { underline: true });
    doc.fontSize(11).fillColor("#333");
    doc.text(`Baza:            $${base.toFixed(2)}`);
    doc.text(`Komisioni (10%): $${fee.toFixed(2)}`);
    doc.text(`TVSH (18%):      $${vat.toFixed(2)}`);
    doc
      .fontSize(13)
      .fillColor("#111")
      .text(`TOTALI:          $${total.toFixed(2)}`);
    doc.moveDown();
    doc.fontSize(10).fillColor("#666").text(`Statusi: ${b.status}`);
    doc.moveDown(2);
    doc
      .fontSize(9)
      .fillColor("#999")
      .text("Faleminderit që zgjodhët QENT. (Pagesë test — projekt akademik)");

    doc.end();
  } catch (e) {
    res.status(500).send("Invoice error: " + e.message);
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
    const { car_id, booking_id, rating, comment } = req.body;
    if (!car_id || !booking_id || !rating) {
      return res
        .status(400)
        .json({
          success: false,
          message: "car_id, booking_id, rating kërkohen",
        });
    }
    // owner_id merret nga vetura
    const carRows = await ReviewModel.rawQuery(
      "SELECT owner_id FROM cars WHERE id = ? LIMIT 1",
      [car_id],
    );
    const ownerId = carRows[0]?.owner_id;
    if (!ownerId) {
      return res.status(404).json({ success: false, message: "Car not found" });
    }
    const review = await ReviewModel.create({
      booking_id,
      reviewer_id: req.userId,
      car_id,
      owner_id: ownerId,
      rating,
      comment: comment || null,
    });
    res.status(201).json({ success: true, data: review });
  } catch (e) {
    if (String(e.message).toLowerCase().includes("duplicate")) {
      return res
        .status(409)
        .json({
          success: false,
          message: "E ke vlerësuar tashmë këtë rezervim",
        });
    }
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

// ============================================================
// OWNER / PARTNER ROUTES
// ============================================================
const ownerRouter = express.Router();

// Behu QENT partner: krijo car_owner (nese s'eshte) + listo veturen
ownerRouter.post("/register", authenticate, async (req, res) => {
  try {
    const b = req.body;

    // 1) Sigurohu qe useri eshte car_owner
    const existing = await PaymentModel.rawQuery(
      "SELECT id FROM car_owners WHERE user_id = ? LIMIT 1",
      [req.userId],
    );
    let ownerId = existing[0]?.id;
    if (!ownerId) {
      const ins = await PaymentModel.rawQuery(
        "INSERT INTO car_owners (user_id, business_name, verification_status) VALUES (?, ?, 'approved')",
        [req.userId, b.full_name || null],
      );
      ownerId = ins.insertId;
      await PaymentModel.rawQuery(
        "UPDATE users SET role = 'car_owner' WHERE id = ?",
        [req.userId],
      ).catch(() => {});
    }

    // 2) Resolvo category_id nga emri (ose merr te paren)
    let categoryId = null;
    if (b.category) {
      const cat = await PaymentModel.rawQuery(
        "SELECT id FROM car_categories WHERE name = ? LIMIT 1",
        [b.category],
      );
      categoryId = cat[0]?.id;
    }
    if (!categoryId) {
      const anyCat = await PaymentModel.rawQuery(
        "SELECT id FROM car_categories ORDER BY sort_order LIMIT 1",
      );
      categoryId = anyCat[0]?.id || 1;
    }

    // 3) Normalizo fuel_type ne enum-in e lejuar
    const fuel = String(b.fuel_type || "petrol").toLowerCase();
    const validFuel = ["petrol", "diesel", "electric", "hybrid"].includes(fuel)
      ? fuel
      : "petrol";

    const pricePerDay = Number(b.price_per_day) || 0;
    const pricePerHour = Math.max(
      1,
      Math.round((pricePerDay / 24) * 100) / 100,
    );

    // 4) Krijo veturen
    const carRes = await PaymentModel.rawQuery(
      `INSERT INTO cars
         (owner_id, brand_id, category_id, model, year, color, license_plate,
          fuel_type, price_per_hour, price_per_day, description, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'available')`,
      [
        ownerId,
        b.brand_id,
        categoryId,
        b.model,
        b.year,
        b.color || null,
        b.license_plate,
        validFuel,
        pricePerHour,
        pricePerDay,
        b.description || null,
      ],
    );
    const carId = carRes.insertId;

    // 5) Imazhet (opsionale)
    if (Array.isArray(b.images)) {
      for (let i = 0; i < b.images.length; i++) {
        const url = b.images[i];
        if (typeof url === "string" && url.length <= 500) {
          try {
            await PaymentModel.rawQuery(
              "INSERT INTO car_images (car_id, image_url, is_primary, sort_order) VALUES (?, ?, ?, ?)",
              [carId, url, i === 0 ? 1 : 0, i],
            );
          } catch (_) {}
        }
      }
    }

    res
      .status(201)
      .json({ success: true, data: { owner_id: ownerId, car_id: carId } });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

// Profili i pronarit
ownerRouter.get("/me", authenticate, async (req, res) => {
  try {
    const rows = await PaymentModel.rawQuery(
      "SELECT * FROM car_owners WHERE user_id = ? LIMIT 1",
      [req.userId],
    );
    res.json({ success: true, data: rows[0] || null });
  } catch (e) {
    res.status(500).json({ success: false, message: e.message });
  }
});

module.exports = {
  paymentRouter,
  reviewRouter,
  chatRouter,
  notificationRouter,
  favoriteRouter,
  promotionRouter,
  ownerRouter,
};
