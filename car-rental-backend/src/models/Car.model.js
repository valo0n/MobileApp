const BaseModel = require("./Base.model");

class CarModel extends BaseModel {
  constructor() {
    super("cars");
  }

  // Merr nje makine me te gjitha detajet
  async findWithDetails(carId) {
    const rows = await this.rawQuery(
      `SELECT c.*, cb.name as brand_name, cb.logo_url as brand_logo,
              cc.name as category_name, co.business_name as owner_name,
              u.first_name as owner_first_name, u.last_name as owner_last_name,
              (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as primary_image
       FROM cars c
       JOIN car_brands cb ON c.brand_id = cb.id
       JOIN car_categories cc ON c.category_id = cc.id
       JOIN car_owners co ON c.owner_id = co.id
       JOIN users u ON co.user_id = u.id
       WHERE c.id = ?`,
      [carId],
    );
    return rows[0] || null;
  }

  // Merr makinat e lira me filtra + imazhin primary
  async findAvailable(filters = {}) {
    let query = `SELECT c.*, cb.name as brand_name, cc.name as category_name,
                        (SELECT image_url FROM car_images WHERE car_id = c.id AND is_primary = TRUE LIMIT 1) as primary_image
                 FROM cars c
                 JOIN car_brands cb ON c.brand_id = cb.id
                 JOIN car_categories cc ON c.category_id = cc.id
                 WHERE c.status = 'available'`;
    const values = [];

    if (filters.category_id) {
      query += ` AND c.category_id = ?`;
      values.push(filters.category_id);
    }
    if (filters.brand_id) {
      query += ` AND c.brand_id = ?`;
      values.push(filters.brand_id);
    }
    if (filters.transmission) {
      query += ` AND c.transmission = ?`;
      values.push(filters.transmission);
    }
    if (filters.fuel_type) {
      query += ` AND c.fuel_type = ?`;
      values.push(filters.fuel_type);
    }
    if (filters.min_price) {
      query += ` AND c.price_per_day >= ?`;
      values.push(filters.min_price);
    }
    if (filters.max_price) {
      query += ` AND c.price_per_day <= ?`;
      values.push(filters.max_price);
    }
    if (filters.min_seats) {
      query += ` AND c.seats >= ?`;
      values.push(filters.min_seats);
    }

    query += ` ORDER BY c.created_at DESC`;

    if (filters.limit) {
      query += ` LIMIT ?`;
      values.push(parseInt(filters.limit));
    }

    return this.rawQuery(query, values);
  }

  async getImages(carId) {
    return this.rawQuery(
      `SELECT * FROM car_images WHERE car_id = ? ORDER BY sort_order`,
      [carId],
    );
  }
}

module.exports = new CarModel();
