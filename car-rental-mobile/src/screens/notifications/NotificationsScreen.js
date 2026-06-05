import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { BackIcon, MoreIcon } from "../../components/common/Icons";
import { NotificationService } from "../../services";

// ── Icons per cdo lloj notification ──
const CheckBadge = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.5 4.5L18 4L18.5 7.5L21.5 9L20 12L21.5 15L18.5 16.5L18 20L14.5 19.5L12 22L9.5 19.5L6 20L5.5 16.5L2.5 15L4 12L2.5 9L5.5 7.5L6 4L9.5 4.5L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M8.5 12L11 14.5L15.5 10"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const ReceiptIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 2H18C18.5 2 19 2.5 19 3V22L16 20L13 22L10 20L7 22L5 20V3C5 2.5 5.5 2 6 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M9 7H15M9 11H15M9 15H12"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
const ClockBadge = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={color}
      strokeWidth="1.5"
      strokeDasharray="2 2"
    />
    <Path
      d="M12 7V12L15 14"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
const WarnBadge = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.5 4.5L18 4L18.5 7.5L21.5 9L20 12L21.5 15L18.5 16.5L18 20L14.5 19.5L12 22L9.5 19.5L6 20L5.5 16.5L2.5 15L4 12L2.5 9L5.5 7.5L6 4L9.5 4.5L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M12 8V13M12 16V16.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const CancelBadge = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 3H14L19 8V21H7C6 21 5 20 5 19V5C5 4 6 3 7 3Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M10 12L15 17M15 12L10 17"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </Svg>
);
const DiscountBadge = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L14.5 4.5L18 4L18.5 7.5L21.5 9L20 12L21.5 15L18.5 16.5L18 20L14.5 19.5L12 22L9.5 19.5L6 20L5.5 16.5L2.5 15L4 12L2.5 9L5.5 7.5L6 4L9.5 4.5L12 2Z"
      stroke={color}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <Path
      d="M9 15L15 9M9.5 9.5H9.51M14.5 14.5H14.51"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const TrashIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const CloseIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const AlertCircle = () => (
  <Svg width="36" height="36" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 9V13M12 17V17.01"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </Svg>
);

// Zgjedh icon-in sipas tipit te notification
const getIcon = (type) => {
  switch (type) {
    case "booking":
      return CheckBadge;
    case "payment":
      return ReceiptIcon;
    case "reminder":
      return ClockBadge;
    case "promo":
      return DiscountBadge;
    default:
      return WarnBadge;
  }
};

// Mock data — perdoret nese backend-i nuk kthen asgje
const MOCK = [
  {
    id: 1,
    type: "booking",
    title: "Car Booking Successful",
    body: "Your car is ready! Check your email for the booking and pickup instructions. Safe travels!",
    time: "10:00 am",
    is_read: false,
    group: "Today",
  },
  {
    id: 2,
    type: "payment",
    title: "Payment Notification",
    body: "Your payment was processed successfully! Enjoy your ride.",
    time: "10:00 am",
    is_read: false,
    group: "Today",
  },
  {
    id: 3,
    type: "reminder",
    title: "Car Pickup/Drop-off time",
    body: "Pickup time confirmed! See you at [Time] for your car rental. Drop-off Time Confirmed! Please",
    time: "09:00 am",
    is_read: true,
    group: "Today",
  },
  {
    id: 4,
    type: "system",
    title: "Late Return Warning",
    body: "Late Return Alert! Please return the car as soon as possible to avoid extra charges.",
    time: "Yesterday",
    is_read: true,
    group: "Previous",
  },
  {
    id: 5,
    type: "system",
    title: "Cancellation Notice",
    body: "Your Reservation Has Been Canceled or Booking Cancelled Successfully.",
    time: "Yesterday",
    is_read: true,
    group: "Previous",
  },
  {
    id: 6,
    type: "promo",
    title: "Discount Notification",
    body: "Congratulations! You've unlocked a 10% discount on your next rental.",
    time: "Yesterday",
    is_read: true,
    group: "Previous",
  },
];

const NotificationsScreen = ({ navigation }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState({});
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await NotificationService.getAll();
      const data = res.data || [];
      if (data.length > 0) {
        // Grupoji ne Today / Previous sipas dates
        const today = new Date().toDateString();
        const mapped = data.map((n) => ({
          ...n,
          group:
            new Date(n.created_at).toDateString() === today
              ? "Today"
              : "Previous",
          time: new Date(n.created_at).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        }));
        setNotifications(mapped);
      } else {
        setNotifications([]);
      }
    } catch (e) {
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const todayList = notifications.filter((n) => n.group === "Today");
  const previousList = notifications.filter((n) => n.group === "Previous");
  const selectedCount = Object.values(selected).filter(Boolean).length;
  const allSelected =
    selectedCount === notifications.length && notifications.length > 0;

  const toggleSelect = (id) => {
    setSelected((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleSelectAll = () => {
    if (allSelected) {
      setSelected({});
    } else {
      const all = {};
      notifications.forEach((n) => {
        all[n.id] = true;
      });
      setSelected(all);
    }
  };

  const enterSelectMode = (id) => {
    setSelectMode(true);
    setSelected({ [id]: true });
  };

  const exitSelectMode = () => {
    setSelectMode(false);
    setSelected({});
  };

  const confirmDelete = async () => {
    const idsToDelete = Object.keys(selected).filter((id) => selected[id]);
    // Fshij nga UI
    setNotifications((prev) =>
      prev.filter((n) => !idsToDelete.includes(String(n.id))),
    );
    setModalVisible(false);
    exitSelectMode();
    // Fshij edhe ne backend
    idsToDelete.forEach((id) => {
      NotificationService.remove(id).catch(() => {});
    });
  };

  const renderNotification = (n) => {
    const Icon = getIcon(n.type);
    const isSelected = !!selected[n.id];
    return (
      <TouchableOpacity
        key={n.id}
        style={styles.notifCard}
        activeOpacity={0.7}
        onLongPress={() => enterSelectMode(n.id)}
        onPress={() => selectMode && toggleSelect(n.id)}
      >
        {selectMode && (
          <View
            style={[styles.checkCircle, isSelected && styles.checkCircleActive]}
          >
            {isSelected && <Text style={styles.checkMark}>✓</Text>}
          </View>
        )}
        <View style={styles.notifIcon}>
          <Icon color="#111" />
        </View>
        <View style={styles.notifContent}>
          <View style={styles.notifTop}>
            <Text style={styles.notifTitle}>{n.title}</Text>
            <View style={styles.notifTimeRow}>
              <Text style={styles.notifTime}>{n.time}</Text>
              {!n.is_read && <View style={styles.unreadDot} />}
            </View>
          </View>
          <Text style={styles.notifBody} numberOfLines={2}>
            {n.body}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        {selectMode ? (
          <>
            <TouchableOpacity
              style={styles.selectAllRow}
              onPress={toggleSelectAll}
            >
              <View
                style={[
                  styles.checkCircle,
                  allSelected && styles.checkCircleActive,
                ]}
              >
                {allSelected && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.selectAllText}>All</Text>
              <Text style={styles.selectedCount}>{selectedCount} Selected</Text>
            </TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                style={{ paddingHorizontal: 12, paddingVertical: 8 }}
                onPress={exitSelectMode}
              >
                <Text style={{ color: "#2563EB", fontWeight: "600" }}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.iconBtn}
                onPress={() => selectedCount > 0 && setModalVisible(true)}
              >
                <TrashIcon color="#111" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => navigation.goBack()}
            >
              <BackIcon size={20} color="#111" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notification</Text>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => notifications.length > 0 && setSelectMode(true)}
            >
              <MoreIcon size={20} color="#111" />
            </TouchableOpacity>
          </>
        )}
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          {/* Today */}
          {todayList.length > 0 && (
            <>
              <View style={styles.sectionRow}>
                <Text style={styles.sectionTitle}>Today</Text>
                {!selectMode && (
                  <Text style={styles.unreadText}>
                    {unreadCount} Unread Notification
                  </Text>
                )}
              </View>
              {todayList.map(renderNotification)}
            </>
          )}

          {/* Previous */}
          {previousList.length > 0 && (
            <>
              <Text style={[styles.sectionTitle, { marginTop: 20 }]}>
                Previous
              </Text>
              {previousList.map(renderNotification)}
            </>
          )}

          {notifications.length === 0 && (
            <Text style={styles.emptyText}>S'ka notifikime</Text>
          )}
        </ScrollView>
      )}

      {/* Delete confirmation modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <TouchableOpacity
              style={styles.modalClose}
              onPress={() => setModalVisible(false)}
            >
              <CloseIcon color="#111" />
            </TouchableOpacity>

            <View style={styles.alertIcon}>
              <AlertCircle />
            </View>

            <Text style={styles.modalTitle}>
              Are you sure you want to delete your notifications permanently?
            </Text>
            <Text style={styles.modalDesc}>
              By doing this, your notifications will be deleted permanently and
              you will not be able to recover your notifications anymore.
            </Text>

            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={confirmDelete}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
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
  selectAllRow: { flexDirection: "row", alignItems: "center", flex: 1 },
  selectAllText: { fontSize: 14, color: "#111", marginRight: 14 },
  selectedCount: { fontSize: 14, fontWeight: "700", color: "#111" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  sectionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 20,
  },
  unreadText: { fontSize: 12, color: "#9CA3AF" },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 0,
    paddingHorizontal: 20,
    paddingVertical: 14,
    marginBottom: 8,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checkCircleActive: { backgroundColor: "#111", borderColor: "#111" },
  checkMark: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  notifIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  notifContent: { flex: 1 },
  notifTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifTitle: { fontSize: 14, fontWeight: "700", color: "#111", flex: 1 },
  notifTimeRow: { flexDirection: "row", alignItems: "center" },
  notifTime: { fontSize: 11, color: "#9CA3AF" },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#3B82F6",
    marginLeft: 6,
  },
  notifBody: { fontSize: 12, color: "#9CA3AF", lineHeight: 18, marginTop: 4 },
  emptyText: { textAlign: "center", color: "#9CA3AF", marginTop: 40 },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "100%",
  },
  modalClose: { position: "absolute", top: 16, right: 16, zIndex: 2 },
  alertIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#EF4444",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    marginTop: 8,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
    lineHeight: 24,
  },
  modalDesc: {
    fontSize: 13,
    color: "#9CA3AF",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalBtnRow: { flexDirection: "row", justifyContent: "space-between" },
  deleteBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#F0F0F0",
    alignItems: "center",
    marginRight: 8,
  },
  deleteBtnText: { color: "#111", fontSize: 15, fontWeight: "700" },
  cancelBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 30,
    backgroundColor: "#2D2D2D",
    alignItems: "center",
    marginLeft: 8,
  },
  cancelBtnText: { color: "#fff", fontSize: 15, fontWeight: "700" },
});

export default NotificationsScreen;
