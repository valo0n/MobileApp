import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import Svg, { Path, Circle, Rect } from "react-native-svg";
import QentLogo from "../../components/common/QentLogo";
import { useAdminViewModel } from "../../viewmodels/Admin.viewmodel";

// ── Icons ──
const CarStatIcon = ({ color = "#fff" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 11L6.5 6.5C6.8 5.6 7.6 5 8.5 5H15.5C16.4 5 17.2 5.6 17.5 6.5L19 11M5 11H19M5 11C3.9 11 3 11.9 3 13V16C3 16.6 3.4 17 4 17H5M19 11C20.1 11 21 11.9 21 13V16C21 16.6 20.6 17 20 17H19M7 17H17M7 17V19C7 19.6 6.6 20 6 20H5.5C4.9 20 4.5 19.6 4.5 19V17M17 17V19C17 19.6 17.4 20 18 20H18.5C19.1 20 19.5 19.6 19.5 19V17"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Circle cx="7" cy="14" r="1" fill={color} />
    <Circle cx="17" cy="14" r="1" fill={color} />
  </Svg>
);
const BookingStatIcon = ({ color = "#fff" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="2"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M16 2V6M8 2V6M3 10H21M8 14H10M14 14H16M8 18H10"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const UserStatIcon = ({ color = "#fff" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M17 21V19C17 16.8 15.2 15 13 15H6C3.8 15 2 16.8 2 19V21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Circle cx="9.5" cy="8" r="4" stroke={color} strokeWidth="1.8" />
    <Path
      d="M22 21V19C22 17.1 20.7 15.5 19 15.1M16 3.1C17.7 3.5 19 5.1 19 7C19 8.9 17.7 10.5 16 10.9"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const RevenueIcon = ({ color = "#fff" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2V22M17 5H9.5C8.5 5 7.5 5.4 6.8 6.1C6 6.9 5.6 7.9 5.6 9C5.6 10.1 6 11.1 6.8 11.9C7.5 12.6 8.5 13 9.5 13H14.5C15.5 13 16.5 13.4 17.2 14.1C18 14.9 18.4 15.9 18.4 17C18.4 18.1 18 19.1 17.2 19.9C16.5 20.6 15.5 21 14.5 21H6"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const LogoutIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 21H5C4.4 21 4 20.6 4 20V4C4 3.4 4.4 3 5 3H9M16 17L21 12L16 7M21 12H9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const TrashIcon = ({ color = "#EF4444" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M3 6H21M19 6V20C19 21 18 22 17 22H7C6 22 5 21 5 20V6M8 6V4C8 3 9 2 10 2H14C15 2 16 3 16 4V6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const TABS = ["Overview", "Cars", "Bookings", "Users"];

const statusColor = (status) => {
  switch (status) {
    case "active":
      return "#10B981";
    case "completed":
      return "#3B82F6";
    case "pending":
      return "#F59E0B";
    case "cancelled":
      return "#EF4444";
    default:
      return "#9CA3AF";
  }
};

const AdminDashboardScreen = ({ navigation }) => {
  const {
    stats,
    cars,
    bookings,
    users,
    loading,
    loadStats,
    deleteCar,
    updateBookingStatus,
  } = useAdminViewModel();

  const [activeTab, setActiveTab] = useState("Overview");
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await loadStats();
    setRefreshing(false);
  };

  const handleDeleteCar = (car) => {
    Alert.alert(
      "Fshij Makinen",
      `A je i sigurt qe don me fshi ${car.model || car.name}?`,
      [
        { text: "Anulo", style: "cancel" },
        {
          text: "Fshij",
          style: "destructive",
          onPress: async () => {
            const ok = await deleteCar(car.id);
            if (!ok) Alert.alert("Gabim", "Nuk u fshi dot makina");
          },
        },
      ],
    );
  };

  const handleBookingStatus = (booking) => {
    Alert.alert("Ndrysho Statusin", "Zgjedh statusin e ri:", [
      {
        text: "Active",
        onPress: () => updateBookingStatus(booking.id, "active"),
      },
      {
        text: "Completed",
        onPress: () => updateBookingStatus(booking.id, "completed"),
      },
      {
        text: "Cancelled",
        onPress: () => updateBookingStatus(booking.id, "cancelled"),
      },
      { text: "Anulo", style: "cancel" },
    ]);
  };

  const handleLogout = () => {
    Alert.alert("Dil", "A je i sigurt qe don me dal?", [
      { text: "Jo", style: "cancel" },
      { text: "Po", onPress: () => navigation.replace("Login") },
    ]);
  };

  // ── Overview Tab ──
  const renderOverview = () => (
    <View>
      <View style={styles.statsGrid}>
        <View style={[styles.statCard, { backgroundColor: "#2D2D2D" }]}>
          <View style={styles.statIconWrap}>
            <CarStatIcon color="#fff" />
          </View>
          <Text style={styles.statValue}>{stats?.totalCars ?? 0}</Text>
          <Text style={styles.statLabel}>Makina Totale</Text>
          <Text style={styles.statSub}>
            {stats?.availableCars ?? 0} t\u00eb lira
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#3B82F6" }]}>
          <View style={styles.statIconWrap}>
            <BookingStatIcon color="#fff" />
          </View>
          <Text style={styles.statValue}>{stats?.totalBookings ?? 0}</Text>
          <Text style={styles.statLabel}>Booking Totale</Text>
          <Text style={styles.statSub}>
            {stats?.activeBookings ?? 0} aktive
          </Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#10B981" }]}>
          <View style={styles.statIconWrap}>
            <UserStatIcon color="#fff" />
          </View>
          <Text style={styles.statValue}>{stats?.totalUsers ?? 0}</Text>
          <Text style={styles.statLabel}>P\u00ebrdorues</Text>
          <Text style={styles.statSub}>t\u00eb regjistruar</Text>
        </View>

        <View style={[styles.statCard, { backgroundColor: "#F59E0B" }]}>
          <View style={styles.statIconWrap}>
            <RevenueIcon color="#fff" />
          </View>
          <Text style={styles.statValue}>
            ${(stats?.revenue ?? 0).toFixed(0)}
          </Text>
          <Text style={styles.statLabel}>T\u00eb Ardhura</Text>
          <Text style={styles.statSub}>totale</Text>
        </View>
      </View>

      {/* Recent bookings */}
      <Text style={styles.sectionTitle}>Booking-et e Fundit</Text>
      {bookings.slice(0, 5).map((b) => (
        <View key={b.id} style={styles.listCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>
              {b.car_model || b.booking_ref || `Booking #${b.id}`}
            </Text>
            <Text style={styles.listSub}>
              {b.first_name ? `${b.first_name} ${b.last_name}` : "Klient"}{" "}
              \u00b7 ${b.total_price}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(b.status) + "22" },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor(b.status) }]}>
              {b.status}
            </Text>
          </View>
        </View>
      ))}
      {bookings.length === 0 && (
        <Text style={styles.emptyText}>S'ka booking-e ende</Text>
      )}
    </View>
  );

  // ── Cars Tab ──
  const renderCars = () => (
    <View>
      <Text style={styles.sectionTitle}>Menaxho Makinat ({cars.length})</Text>
      {cars.map((car) => (
        <View key={car.id} style={styles.listCard}>
          <View style={styles.carThumb}>
            <CarStatIcon color="#9CA3AF" />
          </View>
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.listTitle}>{car.model || car.name}</Text>
            <Text style={styles.listSub}>
              ${car.price_per_day}/dit\u00eb \u00b7 {car.status}
            </Text>
          </View>
          <TouchableOpacity
            style={styles.deleteBtn}
            onPress={() => handleDeleteCar(car)}
          >
            <TrashIcon color="#EF4444" />
          </TouchableOpacity>
        </View>
      ))}
      {cars.length === 0 && (
        <Text style={styles.emptyText}>S'ka makina ende</Text>
      )}
    </View>
  );

  // ── Bookings Tab ──
  const renderBookings = () => (
    <View>
      <Text style={styles.sectionTitle}>
        Menaxho Booking-et ({bookings.length})
      </Text>
      {bookings.map((b) => (
        <TouchableOpacity
          key={b.id}
          style={styles.listCard}
          onPress={() => handleBookingStatus(b)}
        >
          <View style={{ flex: 1 }}>
            <Text style={styles.listTitle}>
              {b.car_model || b.booking_ref || `Booking #${b.id}`}
            </Text>
            <Text style={styles.listSub}>
              {b.first_name ? `${b.first_name} ${b.last_name}` : "Klient"}{" "}
              \u00b7 ${b.total_price}
            </Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: statusColor(b.status) + "22" },
            ]}
          >
            <Text style={[styles.statusText, { color: statusColor(b.status) }]}>
              {b.status}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      {bookings.length === 0 && (
        <Text style={styles.emptyText}>S'ka booking-e ende</Text>
      )}
    </View>
  );

  // ── Users Tab ──
  const renderUsers = () => (
    <View>
      <Text style={styles.sectionTitle}>P\u00ebrdoruesit ({users.length})</Text>
      {users.map((u) => (
        <View key={u.id} style={styles.listCard}>
          <Image
            source={{
              uri: u.avatar_url || `https://i.pravatar.cc/100?u=${u.id}`,
            }}
            style={styles.userAvatar}
          />
          <View style={{ flex: 1, marginLeft: 12 }}>
            <Text style={styles.listTitle}>
              {u.first_name} {u.last_name}
            </Text>
            <Text style={styles.listSub}>{u.email}</Text>
          </View>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: u.is_active ? "#10B98122" : "#EF444422" },
            ]}
          >
            <Text
              style={[
                styles.statusText,
                { color: u.is_active ? "#10B981" : "#EF4444" },
              ]}
            >
              {u.is_active ? "aktiv" : "jo aktiv"}
            </Text>
          </View>
        </View>
      ))}
      {users.length === 0 && (
        <Text style={styles.emptyText}>S'ka p\u00ebrdorues ende</Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <QentLogo size={38} bg="black" fg="white" />
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.brandName}>Qent Admin</Text>
            <Text style={styles.brandSub}>Paneli i Menaxhimit</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogoutIcon color="#111" />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => {
          const active = activeTab === tab;
          return (
            <TouchableOpacity
              key={tab}
              style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(tab)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {loading && !refreshing ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.content}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {activeTab === "Overview" && renderOverview()}
          {activeTab === "Cars" && renderCars()}
          {activeTab === "Bookings" && renderBookings()}
          {activeTab === "Users" && renderUsers()}
        </ScrollView>
      )}
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandName: { fontSize: 17, fontWeight: "700", color: "#111" },
  brandSub: { fontSize: 11, color: "#9CA3AF" },
  logoutBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  tabsRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  tabActive: { backgroundColor: "#111" },
  tabText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },

  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 8,
  },
  statCard: {
    width: "48%",
    borderRadius: 18,
    padding: 16,
    marginBottom: 14,
  },
  statIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  statValue: { fontSize: 26, fontWeight: "800", color: "#fff" },
  statLabel: { fontSize: 13, color: "rgba(255,255,255,0.9)", marginTop: 2 },
  statSub: { fontSize: 11, color: "rgba(255,255,255,0.6)", marginTop: 2 },

  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 12,
  },
  listCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
  },
  listTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  listSub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: { fontSize: 11, fontWeight: "700", textTransform: "capitalize" },
  carThumb: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
  },
  userAvatar: { width: 44, height: 44, borderRadius: 22 },
  deleteBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FEE2E2",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    marginTop: 20,
  },
});

export default AdminDashboardScreen;
