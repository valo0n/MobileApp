const BaseModel = require("./Base.model");

class UserModel extends BaseModel {
  constructor() {
    super("users");
  }

  async findByEmail(email) {
    return this.findOne({ email });
  }

  // Merr user-in bashke me rolet — version i sigurt (pa GROUP BY problem)
  async findWithRoles(userId) {
    const user = await this.findById(userId);
    if (!user) return null;

    const roleRows = await this.rawQuery(
      `SELECT r.name FROM user_roles ur
     JOIN roles r ON ur.role_id = r.id
     WHERE ur.user_id = ?`,
      [userId],
    );

    const roles = roleRows.map((row) => row.name).join(",");
    return { ...user, roles };
  }

  // Cakto nje rol per user
  async assignRole(userId, roleName, assignedBy = null) {
    return this.rawQuery(
      `INSERT INTO user_roles (user_id, role_id, assigned_by)
       SELECT ?, r.id, ? FROM roles r WHERE r.name = ?`,
      [userId, assignedBy, roleName],
    );
  }
}

module.exports = new UserModel();
