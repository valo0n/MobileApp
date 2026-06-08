// ============================================================
// Service modules — API calls organized by feature
// ============================================================

import api from "./api";

// ── Auth Service ──
export const AuthService = {
  register: (data) => api.post("/auth/register", data),
  login: (data) => api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
  refresh: (refreshToken) => api.post("/auth/refresh", { refreshToken }),
  logout: (refreshToken) => api.post("/auth/logout", { refreshToken }),
};

// ── Car Service ──
export const CarService = {
  getAll: (filters = {}) => api.get("/cars", { params: filters }),
  getById: (id) => api.get(`/cars/${id}`),
  getCategories: () => api.get("/cars/categories"),
  getBrands: () => api.get("/cars/brands"),
  create: (data) => api.post("/cars", data),
  update: (id, data) => api.put(`/cars/${id}`, data),
  delete: (id) => api.delete(`/cars/${id}`),
};

// ── Booking Service ──
export const BookingService = {
  getAll: (status) => api.get("/bookings", { params: { status } }),
  getById: (id) => api.get(`/bookings/${id}`),
  create: (data) => api.post("/bookings", data),
  cancel: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
};

// ── Payment Service ──
export const PaymentService = {
  getByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  create: (data) => api.post("/payments", data),
  checkout: (bookingId) =>
    api.post("/payments/checkout", { booking_id: bookingId }),
  confirm: (sessionId) =>
    api.post("/payments/confirm", { session_id: sessionId }),
  createIntent: (amount) => api.post("/payments/intent", { amount }),
  confirmIntent: (paymentIntentId) =>
    api.post("/payments/intent/confirm", {
      payment_intent_id: paymentIntentId,
    }),
  getMethods: () => api.get("/payments/methods"),
  addMethod: (data) => api.post("/payments/methods", data),
  removeMethod: (id) => api.delete(`/payments/methods/${id}`),
};

// ── Owner / Partner Service ──
export const OwnerService = {
  getMyOwner: () => api.get("/owners/me"),
  register: (data) => api.post("/owners/register", data),
};

// ── Review Service ──
export const ReviewService = {
  getByCar: (carId) => api.get(`/reviews/car/${carId}`),
  create: (data) => api.post("/reviews", data),
};

// ── Chat Service ──
export const ChatService = {
  getConversations: () => api.get("/chat/conversations"),
  getMessages: (convId) => api.get(`/chat/conversations/${convId}/messages`),
  sendMessage: (convId, content) =>
    api.post(`/chat/conversations/${convId}/messages`, { content }),
  startConversation: (arg) =>
    api.post(
      "/chat/conversations/start",
      typeof arg === "object" && arg !== null ? arg : { recipient_id: arg },
    ),
  markRead: (convId) => api.put(`/chat/conversations/${convId}/read`),
};

// ── Notification Service ──
export const NotificationService = {
  getAll: (unread = false) => api.get("/notifications", { params: { unread } }),
  getCount: () => api.get("/notifications/count"),
  markAllRead: () => api.put("/notifications/read-all"),
  remove: (id) => api.delete(`/notifications/${id}`),
};

// ── Favorite Service ──
export const FavoriteService = {
  getAll: () => api.get("/favorites"),
  toggle: (carId) => api.post("/favorites/toggle", { car_id: carId }),
};

// ── Promotion Service ──
export const PromotionService = {
  getAll: () => api.get("/promotions"),
  validate: (code) => api.post("/promotions/validate", { code }),
};
