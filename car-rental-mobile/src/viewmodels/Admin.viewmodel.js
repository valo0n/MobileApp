// ============================================================
// Admin ViewModel — menaxhon te dhenat per dashboard-in
// ============================================================

import { useState } from "react";
import api from "../services/api";

export const useAdminViewModel = () => {
  const [stats, setStats] = useState(null);
  const [cars, setCars] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Merr te gjitha statistikat per dashboard
  const loadStats = async () => {
    setLoading(true);
    try {
      // Marrim te dhenat nga endpoint-et ekzistuese dhe i numerojm
      const [carsRes, bookingsRes, usersRes] = await Promise.all([
        api.get("/cars"),
        api.get("/bookings"),
        api.get("/users"),
      ]);

      const carsList = carsRes.data || [];
      const bookingsList = bookingsRes.data || [];
      const usersList = usersRes.data || [];

      // Llogarit te ardhurat totale nga booking-et e perfunduara
      const revenue = bookingsList
        .filter((b) => b.status === "completed" || b.status === "active")
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

      setStats({
        totalCars: carsList.length,
        availableCars: carsList.filter((c) => c.status === "available").length,
        totalBookings: bookingsList.length,
        activeBookings: bookingsList.filter((b) => b.status === "active")
          .length,
        totalUsers: usersList.length,
        revenue,
      });

      setCars(carsList);
      setBookings(bookingsList);
      setUsers(usersList);
    } catch (e) {
      console.error("Admin load error:", e.message);
      // Te dhena mock nese backend-i nuk pergjigjet
      setStats({
        totalCars: 0,
        availableCars: 0,
        totalBookings: 0,
        activeBookings: 0,
        totalUsers: 0,
        revenue: 0,
      });
    } finally {
      setLoading(false);
    }
  };

  // Fshij nje makine
  const deleteCar = async (carId) => {
    try {
      await api.delete(`/cars/${carId}`);
      setCars((prev) => prev.filter((c) => c.id !== carId));
      return true;
    } catch (e) {
      console.error("Delete car error:", e.message);
      return false;
    }
  };

  // Ndrysho statusin e nje booking-u
  const updateBookingStatus = async (bookingId, status) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status });
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status } : b)),
      );
      return true;
    } catch (e) {
      console.error("Update booking error:", e.message);
      return false;
    }
  };

  return {
    stats,
    cars,
    bookings,
    users,
    loading,
    loadStats,
    deleteCar,
    updateBookingStatus,
  };
};
