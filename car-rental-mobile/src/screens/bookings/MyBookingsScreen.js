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
  Modal,
  TextInput,
  Linking,
} from "react-native";
import * as SecureStore from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";
import { BackIcon } from "../../components/common/Icons";
import { useBookingsViewModel } from "../../viewmodels";
import { ReviewService } from "../../services";
import { API_BASE_URL } from "../../services/api";

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

  // Review modal
  const [reviewBooking, setReviewBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const openInvoice = async (b) => {
    try {
      const token = await SecureStore.getItemAsync("auth_token");
      const url = `${API_BASE_URL}/payments/invoice/${b.id}?token=${token}`;
      Linking.openURL(url);
    } catch (e) {
      Alert.alert("Gabim", "Nuk u hap fatura");
    }
  };

  const openReview = (b) => {
    setReviewBooking(b);
    setRating(5);
    setComment("");
  };

  const submitReview = async () => {
    if (!reviewBooking) return;
    setSubmitting(true);
    try {
      await ReviewService.create({
        booking_id: reviewBooking.id,
        car_id: reviewBooking.car_id,
        rating,
        comment,
      });
      setReviewBooking(null);
      Alert.alert("Faleminderit", "Vlerësimi u ruajt me sukses");
    } catch (e) {
      Alert.alert("Gabim", e.message || "Nuk u ruajt vlerësimi");
    } finally {
      setSubmitting(false);
    }
  };

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
            const res = await cancelBooking(booking.id, "Cancelled by user");
            if (res?.eligible) {
              Alert.alert(
                "Anuluar",
                `Rezervimi u anulua. Rimbursim 100%: $${res.refunded}.`,
              );
            } else {
              Alert.alert(
                "Anuluar",
                "Rezervimi u anulua. Pa rimbursim (më pak se 48 orë para marrjes).",
              );
            }
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
          <View style={{ flexDirection: "row", gap: 8 }}>
            {["confirmed", "completed", "active"].includes(b.status) && (
              <>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => openInvoice(b)}
                >
                  <Text style={styles.secondaryText}>Faturë</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.secondaryBtn}
                  onPress={() => openReview(b)}
                >
                  <Text style={styles.secondaryText}>Vlerëso</Text>
                </TouchableOpacity>
              </>
            )}
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

      {/* Modal: Shkrim review (KF-09) */}
      <Modal
        visible={!!reviewBooking}
        transparent
        animationType="fade"
        onRequestClose={() => setReviewBooking(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Vlerëso qiranë</Text>
            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <TouchableOpacity key={s} onPress={() => setRating(s)}>
                  <Text style={[styles.star, s <= rating && styles.starActive]}>
                    ★
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TextInput
              style={styles.commentInput}
              placeholder="Shkruaj një koment (opsionale)"
              placeholderTextColor="#9CA3AF"
              value={comment}
              onChangeText={setComment}
              multiline
            />
            <View style={styles.modalBtns}>
              <TouchableOpacity
                style={styles.modalCancel}
                onPress={() => setReviewBooking(null)}
              >
                <Text style={styles.modalCancelText}>Anulo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalSubmit}
                onPress={submitReview}
                disabled={submitting}
              >
                <Text style={styles.modalSubmitText}>
                  {submitting ? "..." : "Dërgo"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
  secondaryBtn: {
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#D1D5DB",
  },
  secondaryText: { color: "#111", fontWeight: "600", fontSize: 13 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: { backgroundColor: "#fff", borderRadius: 18, padding: 20 },
  modalTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
  },
  starsRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 14,
  },
  star: { fontSize: 36, color: "#D1D5DB", marginHorizontal: 4 },
  starActive: { color: "#F5A623" },
  commentInput: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    padding: 12,
    minHeight: 80,
    textAlignVertical: "top",
    color: "#111",
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
    gap: 10,
  },
  modalCancel: { paddingHorizontal: 16, paddingVertical: 10 },
  modalCancelText: { color: "#6B7280", fontWeight: "600" },
  modalSubmit: {
    backgroundColor: "#111",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 22,
  },
  modalSubmitText: { color: "#fff", fontWeight: "700" },
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
