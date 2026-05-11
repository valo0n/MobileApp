const BaseModel = require('./Base.model');
const { v4: uuidv4 } = require('uuid');

class BookingModel extends BaseModel {
  constructor() {
    super('bookings');
  }

  generateRef() {
    return 'BK-' + uuidv4().slice(0, 8).toUpperCase();
  }

  async findWithDetails(bookingId) {
    const rows = await this.rawQuery(
      `SELECT b.*, c.model as car_model, cb.name as brand_name,
              u.first_name, u.last_name, u.email, u.phone,
              pl.name as pickup_location_name, dl.name as dropoff_location_name
       FROM bookings b
       JOIN cars c ON b.car_id = c.id
       JOIN car_brands cb ON c.brand_id = cb.id
       JOIN users u ON b.user_id = u.id
       LEFT JOIN locations pl ON b.pickup_location_id = pl.id
       LEFT JOIN locations dl ON b.dropoff_location_id = dl.id
       WHERE b.id = ?`,
      [bookingId]
    );
    return rows[0] || null;
  }

  async findByUser(userId, status = null) {
    let query = `SELECT b.*, c.model as car_model, cb.name as brand_name
                 FROM bookings b
                 JOIN cars c ON b.car_id = c.id
                 JOIN car_brands cb ON c.brand_id = cb.id
                 WHERE b.user_id = ?`;
    const values = [userId];

    if (status) {
      query += ` AND b.status = ?`;
      values.push(status);
    }

    query += ` ORDER BY b.created_at DESC`;
    return this.rawQuery(query, values);
  }
}

module.exports = new BookingModel();
