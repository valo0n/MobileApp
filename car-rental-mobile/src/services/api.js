// ============================================================
// API Service — connects React Native to Node.js backend
// ============================================================
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";

// IP-ja e kompjuterit nga i cili Expo po e servon app-in (LAN).
// Punon automatikisht ne emulator EDHE ne telefon real.
const hostUri =
  Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || "";
const host = hostUri.split(":")[0] || "10.0.2.2"; // fallback per emulator

const API_BASE_URL = __DEV__
  ? `http://${host}:3000/api`
  : "https://your-production-url.com/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// ── Attach token to every request ──
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("auth_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ── Handle response errors ──
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ message, status: error.response?.status });
  },
);

export default api;
