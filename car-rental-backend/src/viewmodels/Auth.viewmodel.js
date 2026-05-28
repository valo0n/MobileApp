const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("../config/app");
const UserModel = require("../models/User.model");

class AuthViewModel {
  async register({
    first_name,
    last_name,
    email,
    phone,
    password,
    role = "customer",
  }) {
    // Kontrollo nese user-i ekziston
    const existing = await UserModel.findByEmail(email);
    if (existing) {
      throw { status: 409, message: "Email already registered" };
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, 12);

    // Krijo user-in
    const user = await UserModel.create({
      first_name,
      last_name,
      email,
      phone: phone || null,
      password_hash,
      is_verified: true,
      is_active: true,
    });

    // Cakto role-in
    await UserModel.assignRole(user.id, role);

    // Merr user-in me role
    const userWithRoles = await UserModel.findWithRoles(user.id);

    // Token
    const token = this._generateToken(user.id);

    return {
      user: this._sanitize(userWithRoles),
      token,
    };
  }

  async login({ email, password }) {
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw { status: 401, message: "Invalid email or password" };
    }

    if (!user.is_active) {
      throw { status: 403, message: "Account is deactivated" };
    }

    const isValid = await bcrypt.compare(password, user.password_hash);
    if (!isValid) {
      throw { status: 401, message: "Invalid email or password" };
    }

    // Update last login
    await UserModel.update(user.id, { last_login_at: new Date() });

    // Merr user-in me role
    const userWithRoles = await UserModel.findWithRoles(user.id);

    const token = this._generateToken(user.id);

    return {
      user: this._sanitize(userWithRoles),
      token,
    };
  }

  async getProfile(userId) {
    const user = await UserModel.findWithRoles(userId);
    if (!user) throw { status: 404, message: "User not found" };
    return this._sanitize(user);
  }

  _generateToken(userId) {
    return jwt.sign({ userId }, config.jwt.secret, {
      expiresIn: config.jwt.expiresIn,
    });
  }

  // Hek password_hash — i sigurt edhe nese user osht null
  _sanitize(user) {
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  }
}

module.exports = new AuthViewModel();
