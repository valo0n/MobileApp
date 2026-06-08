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

// ── Handle response: auto-refresh access token on 401 (KF-02) ──
api.interceptors.response.use(
  (response) => response.data,
  async (error) => {
    const original = error.config;
    const status = error.response?.status;

    const skip =
      !original ||
      original._retry ||
      (original.url || "").includes("/auth/refresh") ||
      (original.url || "").includes("/auth/login") ||
      (original.url || "").includes("/auth/register");

    if (status === 401 && !skip) {
      original._retry = true;
      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");
        if (!refreshToken) throw new Error("no refresh token");

        // axios i paster qe te mos hyje ne kete interceptor (loop)
        const r = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const data = r.data?.data || {};
        if (data.accessToken) {
          await SecureStore.setItemAsync("auth_token", data.accessToken);
          if (data.refreshToken) {
            await SecureStore.setItemAsync("refresh_token", data.refreshToken);
          }
          original.headers = original.headers || {};
          original.headers.Authorization = `Bearer ${data.accessToken}`;
          return api(original); // ripersrit kerkesen origjinale
        }
      } catch (e) {
        // Refresh deshtoi -> pastro token-at (useri duhet te ri-logohet)
        await SecureStore.deleteItemAsync("auth_token");
        await SecureStore.deleteItemAsync("refresh_token");
      }
    }

    const message = error.response?.data?.message || "Something went wrong";
    return Promise.reject({ message, status });
  },
);

export { API_BASE_URL };
export default api;
