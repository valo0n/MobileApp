// ============================================================
// CAR RENTAL APP — Server Entry Point
// ============================================================

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config/app');
const { testConnection } = require('./config/database');

// Import Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const carRoutes = require('./routes/car.routes');
const bookingRoutes = require('./routes/booking.routes');
const paymentRoutes = require('./routes/payment.routes');
const reviewRoutes = require('./routes/review.routes');
const chatRoutes = require('./routes/chat.routes');
const notificationRoutes = require('./routes/notification.routes');
const favoriteRoutes = require('./routes/favorite.routes');
const promotionRoutes = require('./routes/promotion.routes');

const app = express();

// ── Middleware ──
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, '..', 'uploads')));

// ── Routes ──
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/promotions', promotionRoutes);

// ── Health Check ──
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ── Error Handler ──
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(err.status || 500).json({
    success: false,
    message: config.nodeEnv === 'development' ? err.message : 'Internal server error',
  });
});

// ── Start Server ──
const start = async () => {
  await testConnection();
  app.listen(config.port, () => {
    console.log(`🚗 Car Rental API running on port ${config.port}`);
    console.log(`   Environment: ${config.nodeEnv}`);
  });
};

start();

module.exports = app;
