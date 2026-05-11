const BaseModel = require('./Base.model');

class UserModel extends BaseModel {
  constructor() {
    super('users');
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  async findWithRoles(userId) {
    const [rows] = await this.rawQuery(
      `SELECT u.*, GROUP_CONCAT(r.name) as roles
       FROM users u
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE u.id = ?
       GROUP BY u.id`,
      [userId]
    );
    return rows[0] || null;
  }

  async assignRole(userId, roleName, assignedBy = null) {
    return this.rawQuery(
      `INSERT INTO user_roles (user_id, role_id, assigned_by)
       SELECT ?, r.id, ? FROM roles r WHERE r.name = ?`,
      [userId, assignedBy, roleName]
    );
  }
}

module.exports = new UserModel();
