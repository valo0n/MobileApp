const BaseModel = require('./Base.model');

// ── Payment Model ──
class PaymentModel extends BaseModel {
  constructor() { super('payments'); }

  async findByBooking(bookingId) {
    return this.rawQuery(
      `SELECT p.*, pm.type as method_type, pm.card_brand, pm.last_four
       FROM payments p
       LEFT JOIN payment_methods pm ON p.payment_method_id = pm.id
       WHERE p.booking_id = ?`,
      [bookingId]
    );
  }
}

// ── Review Model ──
class ReviewModel extends BaseModel {
  constructor() { super('reviews'); }

  async findByCar(carId) {
    return this.rawQuery(
      `SELECT r.*, u.first_name, u.last_name, u.avatar_url
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.car_id = ? AND r.is_visible = TRUE
       ORDER BY r.created_at DESC`,
      [carId]
    );
  }

  async getAverageRating(carId) {
    const rows = await this.rawQuery(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as total_reviews
       FROM reviews WHERE car_id = ? AND is_visible = TRUE`,
      [carId]
    );
    return rows[0];
  }
}

// ── Conversation Model ──
class ConversationModel extends BaseModel {
  constructor() { super('conversations'); }

  async findByUser(userId) {
    return this.rawQuery(
      `SELECT c.*, m.content as last_message, m.created_at as last_message_at,
              u.first_name, u.last_name, u.avatar_url
       FROM conversations c
       JOIN conversation_participants cp1 ON c.id = cp1.conversation_id AND cp1.user_id = ?
       JOIN conversation_participants cp2 ON c.id = cp2.conversation_id AND cp2.user_id != ?
       JOIN users u ON cp2.user_id = u.id
       LEFT JOIN messages m ON m.id = (
         SELECT id FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1
       )
       ORDER BY c.updated_at DESC`,
      [userId, userId]
    );
  }
}

// ── Message Model ──
class MessageModel extends BaseModel {
  constructor() { super('messages'); }

  async findByConversation(conversationId, limit = 50) {
    return this.rawQuery(
      `SELECT m.*, u.first_name, u.last_name, u.avatar_url
       FROM messages m
       JOIN users u ON m.sender_id = u.id
       WHERE m.conversation_id = ?
       ORDER BY m.created_at ASC
       LIMIT ?`,
      [conversationId, limit]
    );
  }
}

// ── Notification Model ──
class NotificationModel extends BaseModel {
  constructor() { super('notifications'); }

  async findByUser(userId, unreadOnly = false) {
    let query = `SELECT * FROM notifications WHERE user_id = ?`;
    if (unreadOnly) query += ` AND is_read = FALSE`;
    query += ` ORDER BY created_at DESC`;
    return this.rawQuery(query, [userId]);
  }

  async markAllRead(userId) {
    return this.rawQuery(
      `UPDATE notifications SET is_read = TRUE, read_at = NOW() WHERE user_id = ? AND is_read = FALSE`,
      [userId]
    );
  }
}

// ── Favorite Model ──
class FavoriteModel extends BaseModel {
  constructor() { super('favorites'); }

  async findByUser(userId) {
    return this.rawQuery(
      `SELECT f.*, c.model, c.price_per_day, c.average_rating, cb.name as brand_name,
              ci.image_url as primary_image
       FROM favorites f
       JOIN cars c ON f.car_id = c.id
       JOIN car_brands cb ON c.brand_id = cb.id
       LEFT JOIN car_images ci ON c.id = ci.car_id AND ci.is_primary = TRUE
       WHERE f.user_id = ?
       ORDER BY f.created_at DESC`,
      [userId]
    );
  }

  async toggle(userId, carId) {
    const existing = await this.findOne({ user_id: userId, car_id: carId });
    if (existing) {
      await this.delete(existing.id);
      return { action: 'removed' };
    }
    await this.create({ user_id: userId, car_id: carId });
    return { action: 'added' };
  }
}

// ── Promotion Model ──
class PromotionModel extends BaseModel {
  constructor() { super('promotions'); }

  async findActiveByCode(code) {
    const rows = await this.rawQuery(
      `SELECT * FROM promotions
       WHERE code = ? AND is_active = TRUE
       AND start_date <= NOW() AND end_date >= NOW()
       AND (usage_limit IS NULL OR used_count < usage_limit)`,
      [code]
    );
    return rows[0] || null;
  }
}

module.exports = {
  PaymentModel: new PaymentModel(),
  ReviewModel: new ReviewModel(),
  ConversationModel: new ConversationModel(),
  MessageModel: new MessageModel(),
  NotificationModel: new NotificationModel(),
  FavoriteModel: new FavoriteModel(),
  PromotionModel: new PromotionModel(),
};
