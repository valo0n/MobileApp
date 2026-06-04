import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Alert,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { BackIcon } from "../../components/common/Icons";
import { useBookingsViewModel } from "../../viewmodels";

const FILTERS = [
  { key: "all", label: "All" },
  { key: "active", label: "Active" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

const STATUS_STYLE = {
  pending: { bg: "#FEF3C7", color: "#B45309", label: "Pending" },
  confirmed: { bg: "#DBEAFE", color: "#1D4ED8", label: "Confirmed" },
  active: { bg: "#DCFCE7", color: "#15803D", label: "Active" },
  completed: { bg: "#E5E7EB", color: "#374151", label: "Completed" },
  cancelled: { bg: "#FEE2E2", color: "#B91C1C", label: "Cancelled" },
  expired: { bg: "#E5E7EB", color: "#6B7280", label: "Expired" },
};

const fmtDate = (d) => {
  if (!d) return "—";
  try {
    return new Date(d).toLocaleDateString(undefined, {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return d;
  }
};

const MyBookingsScreen = ({ navigation }) => {
  const { bookings, loadBookings, cancelBooking } = useBookingsViewModel();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState("all");

  const fetchData = useCallback(async () => {
    try {
      await loadBookings();
    } catch (e) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [loadBookings]);

  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      fetchData();
    }, [fetchData]),
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  const onCancel = (booking) => {
    Alert.alert("Cancel booking", "Are you sure you want to cancel?", [
      { text: "No", style: "cancel" },
      {
        text: "Yes, cancel",
        style: "destructive",
        onPress: async () => {
          try {
            await cancelBooking(booking.id, "Cancelled by user");
          } catch (e) {
            Alert.alert("Error", e.message || "Could not cancel");
          }
        },
      },
    ]);
  };

  const filtered = bookings.filter((b) => {
    if (filter === "all") return true;
    if (filter === "active")
      return ["pending", "confirmed", "active"].includes(b.status);
    return b.status === filter;
  });

  const renderCard = (b) => {
    const name = `${b.brand_name || ""} ${b.car_model || ""}`.trim();
    const st = STATUS_STYLE[b.status] || STATUS_STYLE.pending;
    const canCancel = ["pending", "confirmed"].includes(b.status);

    return (
      <View key={b.id} style={styles.card}>
        <View style={styles.cardTop}>
          <Text style={styles.carName} numberOfLines={1}>
            {name || "Car"}
          </Text>
          <View style={[styles.badge, { backgroundColor: st.bg }]}>
            <Text style={[styles.badgeText, { color: st.color }]}>
              {st.label}
            </Text>
          </View>
        </View>

        <Text style={styles.ref}>Ref: {b.booking_ref}</Text>

        <View style={styles.divider} />

        <View style={styles.dateRow}>
          <View style={styles.dateCol}>
            <Text style={styles.dateLabel}>Pick-up</Text>
            <Text style={styles.dateValue}>{fmtDate(b.pickup_datetime)}</Text>
          </View>
          <View style={styles.dateCol}>
            <Text style={styles.dateLabel}>Drop-off</Text>
            <Text style={styles.dateValue}>{fmtDate(b.dropoff_datetime)}</Text>
          </View>
        </View>

        <View style={styles.cardBottom}>
          <Text style={styles.total}>
            {b.currency || "USD"} {parseFloat(b.total_price || 0).toFixed(2)}
          </Text>
          {canCancel && (
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => onCancel(b)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Previous Rent</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Filter chips */}
      <View style={styles.filterRow}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.key}
            style={[styles.filterChip, filter === f.key && styles.filterActive]}
            onPress={() => setFilter(f.key)}
          >
            <Text
              style={[
                styles.filterText,
                filter === f.key && styles.filterTextActive,
              ]}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : filtered.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🧾</Text>
          <Text style={styles.emptyTitle}>No bookings here</Text>
          <Text style={styles.emptySub}>
            Your rentals will appear in this list.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.browseText}>Find a car</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 110 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {filtered.map(renderCard)}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  filterActive: { backgroundColor: "#2D2D2D", borderColor: "#2D2D2D" },
  filterText: { fontSize: 13, color: "#374151" },
  filterTextActive: { color: "#fff", fontWeight: "600" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  carName: { fontSize: 16, fontWeight: "700", color: "#111", flex: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: "700" },
  ref: { fontSize: 12, color: "#9CA3AF", marginTop: 4 },
  divider: { height: 1, backgroundColor: "#F3F4F6", marginVertical: 12 },
  dateRow: { flexDirection: "row", justifyContent: "space-between" },
  dateCol: { flex: 1 },
  dateLabel: { fontSize: 12, color: "#9CA3AF" },
  dateValue: { fontSize: 14, color: "#111", fontWeight: "600", marginTop: 2 },
  cardBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 14,
  },
  total: { fontSize: 17, fontWeight: "800", color: "#111" },
  cancelBtn: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  cancelText: { color: "#EF4444", fontWeight: "700", fontSize: 13 },
  emptyEmoji: { fontSize: 44, marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  emptySub: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 6,
    marginBottom: 20,
  },
  browseBtn: {
    backgroundColor: "#2D2D2D",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
  },
  browseText: { color: "#fff", fontWeight: "700" },
});

export default MyBookingsScreen;
