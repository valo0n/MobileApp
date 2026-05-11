// ============================================================
// ViewModels — React hooks implementing MVVM pattern
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import * as SecureStore from 'expo-secure-store';
import { AuthService, CarService, BookingService, ChatService, NotificationService, FavoriteService } from '../services';

// ── Auth ViewModel ──
export const useAuthViewModel = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const register = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.register(data);
      await SecureStore.setItemAsync('auth_token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (e) { setError(e.message); throw e; }
    finally { setLoading(false); }
  };

  const login = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const res = await AuthService.login(data);
      await SecureStore.setItemAsync('auth_token', res.data.token);
      setUser(res.data.user);
      return res.data;
    } catch (e) { setError(e.message); throw e; }
    finally { setLoading(false); }
  };

  const logout = async () => {
    await SecureStore.deleteItemAsync('auth_token');
    setUser(null);
  };

  const loadProfile = async () => {
    try {
      const res = await AuthService.getProfile();
      setUser(res.data);
    } catch { setUser(null); }
  };

  return { user, loading, error, register, login, logout, loadProfile };
};

// ── Cars ViewModel ──
export const useCarsViewModel = () => {
  const [cars, setCars] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCars = useCallback(async (filters = {}) => {
    setLoading(true);
    try {
      const res = await CarService.getAll(filters);
      setCars(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const loadCategories = async () => {
    try {
      const res = await CarService.getCategories();
      setCategories(res.data);
    } catch (e) { console.error(e); }
  };

  const loadBrands = async () => {
    try {
      const res = await CarService.getBrands();
      setBrands(res.data);
    } catch (e) { console.error(e); }
  };

  return { cars, categories, brands, loading, loadCars, loadCategories, loadBrands };
};

// ── Bookings ViewModel ──
export const useBookingsViewModel = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadBookings = useCallback(async (status = null) => {
    setLoading(true);
    try {
      const res = await BookingService.getAll(status);
      setBookings(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, []);

  const createBooking = async (data) => {
    const res = await BookingService.create(data);
    return res.data;
  };

  const cancelBooking = async (id, reason) => {
    await BookingService.cancel(id, reason);
    loadBookings();
  };

  return { bookings, loading, loadBookings, createBooking, cancelBooking };
};

// ── Chat ViewModel ──
export const useChatViewModel = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadConversations = async () => {
    setLoading(true);
    try {
      const res = await ChatService.getConversations();
      setConversations(res.data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const loadMessages = async (convId) => {
    const res = await ChatService.getMessages(convId);
    setMessages(res.data);
  };

  const sendMessage = async (convId, content) => {
    const res = await ChatService.sendMessage(convId, content);
    setMessages((prev) => [...prev, res.data]);
    return res.data;
  };

  return { conversations, messages, loading, loadConversations, loadMessages, sendMessage };
};

// ── Notifications ViewModel ──
export const useNotificationsViewModel = () => {
  const [notifications, setNotifications] = useState([]);

  const load = async (unreadOnly = false) => {
    const res = await NotificationService.getAll(unreadOnly);
    setNotifications(res.data);
  };

  const markAllRead = async () => {
    await NotificationService.markAllRead();
    load();
  };

  return { notifications, load, markAllRead };
};

// ── Favorites ViewModel ──
export const useFavoritesViewModel = () => {
  const [favorites, setFavorites] = useState([]);

  const load = async () => {
    const res = await FavoriteService.getAll();
    setFavorites(res.data);
  };

  const toggle = async (carId) => {
    const res = await FavoriteService.toggle(carId);
    load();
    return res.data;
  };

  return { favorites, load, toggle };
};
