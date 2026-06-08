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

    // Tokens (access + refresh)
    const tokens = await this._issueTokens(user.id);

    return {
      user: this._sanitize(userWithRoles),
      ...tokens,
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

    const tokens = await this._issueTokens(user.id);

    return {
      user: this._sanitize(userWithRoles),
      ...tokens,
    };
  }

  async getProfile(userId) {
    const user = await UserModel.findWithRoles(userId);
    if (!user) throw { status: 404, message: "User not found" };
    return this._sanitize(user);
  }

  // Refresh: verifikon refresh token-in, e rrotullon (rotation) dhe lëshon access të ri
  async refresh(refreshToken) {
    if (!refreshToken) throw { status: 401, message: "No refresh token" };
    let payload;
    try {
      payload = jwt.verify(refreshToken, config.jwt.refreshSecret);
    } catch (e) {
      throw { status: 401, message: "Invalid refresh token" };
    }
    // Duhet të ekzistojë në DB (përndryshe është revokuar/rrotulluar)
    const rows = await UserModel.rawQuery(
      "SELECT id FROM refresh_tokens WHERE token = ? AND expires_at > NOW() LIMIT 1",
      [refreshToken],
    );
    if (!rows[0]) throw { status: 401, message: "Refresh token revoked" };

    // Rotation: fshi të vjetrin, lësho çift të ri
    await UserModel.rawQuery("DELETE FROM refresh_tokens WHERE token = ?", [
      refreshToken,
    ]);
    return this._issueTokens(payload.userId);
  }

  // Logout: fshi refresh token-in nga DB
  async logout(refreshToken) {
    if (refreshToken) {
      await UserModel.rawQuery("DELETE FROM refresh_tokens WHERE token = ?", [
        refreshToken,
      ]);
    }
    return { message: "Logged out" };
  }

  // Lësho access (15m) + refresh (7d); ruaj refresh-in në DB
  async _issueTokens(userId) {
    const accessToken = jwt.sign(
      { userId, type: "access" },
      config.jwt.accessSecret,
      { expiresIn: config.jwt.accessExpiresIn },
    );
    const refreshToken = jwt.sign(
      { userId, type: "refresh" },
      config.jwt.refreshSecret,
      { expiresIn: config.jwt.refreshExpiresIn },
    );
    const expiresAt = new Date(Date.now() + this._refreshMs());
    await UserModel.rawQuery(
      "INSERT INTO refresh_tokens (user_id, token, expires_at) VALUES (?, ?, ?)",
      [userId, refreshToken, expiresAt],
    );
    return { accessToken, refreshToken };
  }

  _refreshMs() {
    const v = config.jwt.refreshExpiresIn || "7d";
    const n = parseInt(v) || 7;
    if (v.endsWith("h")) return n * 3600000;
    if (v.endsWith("m")) return n * 60000;
    return n * 86400000; // ditë (default)
  }

  // Hek password_hash — i sigurt edhe nese user osht null
  _sanitize(user) {
    if (!user) return null;
    const { password_hash, ...safe } = user;
    return safe;
  }
}

module.exports = new AuthViewModel();
