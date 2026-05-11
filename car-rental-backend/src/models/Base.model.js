// ============================================================
// Base Model — shared CRUD operations for all models
// ============================================================

const { pool } = require('../config/database');

class BaseModel {
  constructor(tableName) {
    this.tableName = tableName;
  }

  async findAll(conditions = {}, options = {}) {
    let query = `SELECT * FROM ${this.tableName}`;
    const values = [];

    if (Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map((key) => {
          values.push(conditions[key]);
          return `${key} = ?`;
        })
        .join(' AND ');
      query += ` WHERE ${where}`;
    }

    if (options.orderBy) query += ` ORDER BY ${options.orderBy}`;
    if (options.limit) {
      query += ` LIMIT ?`;
      values.push(options.limit);
    }
    if (options.offset) {
      query += ` OFFSET ?`;
      values.push(options.offset);
    }

    const [rows] = await pool.execute(query, values);
    return rows;
  }

  async findById(id) {
    const [rows] = await pool.execute(
      `SELECT * FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return rows[0] || null;
  }

  async findOne(conditions) {
    const values = [];
    const where = Object.keys(conditions)
      .map((key) => {
        values.push(conditions[key]);
        return `${key} = ?`;
      })
      .join(' AND ');

    const [rows] = await pool.execute(
      `SELECT * FROM ${this.tableName} WHERE ${where} LIMIT 1`,
      values
    );
    return rows[0] || null;
  }

  async create(data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const placeholders = keys.map(() => '?').join(', ');

    const [result] = await pool.execute(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`,
      values
    );
    return { id: result.insertId, ...data };
  }

  async update(id, data) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const set = keys.map((key) => `${key} = ?`).join(', ');

    const [result] = await pool.execute(
      `UPDATE ${this.tableName} SET ${set} WHERE id = ?`,
      [...values, id]
    );
    return result.affectedRows > 0;
  }

  async delete(id) {
    const [result] = await pool.execute(
      `DELETE FROM ${this.tableName} WHERE id = ?`,
      [id]
    );
    return result.affectedRows > 0;
  }

  async count(conditions = {}) {
    let query = `SELECT COUNT(*) as total FROM ${this.tableName}`;
    const values = [];

    if (Object.keys(conditions).length > 0) {
      const where = Object.keys(conditions)
        .map((key) => {
          values.push(conditions[key]);
          return `${key} = ?`;
        })
        .join(' AND ');
      query += ` WHERE ${where}`;
    }

    const [rows] = await pool.execute(query, values);
    return rows[0].total;
  }

  async rawQuery(sql, values = []) {
    const [rows] = await pool.execute(sql, values);
    return rows;
  }
}

module.exports = BaseModel;
