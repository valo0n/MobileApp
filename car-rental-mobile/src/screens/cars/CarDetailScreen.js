import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import {
  BackIcon,
  MoreIcon,
  HeartIcon,
  StarIcon,
} from "../../components/common/Icons";

// ── Mini feature icons ──
const SeatIconSm = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 19H8M16 19H19M7 19V14M17 19V14M5 14H19C19.5523 14 20 13.5523 20 13V8C20 6.89543 19.1046 6 18 6H6C4.89543 6 4 6.89543 4 8V13C4 13.5523 4.44772 14 5 14Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const EngineIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
    <Path
      d="M19 12H21M3 12H5M12 3V5M12 19V21M18.36 18.36L19.78 19.78M4.22 4.22L5.64 5.64M18.36 5.64L19.78 4.22M4.22 19.78L5.64 18.36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const SpeedIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 14L18 8M3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 14.4853 19.9853 16.7353 18.3553 18.3553H5.64463C4.01474 16.7353 3 14.4853 3 12Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const AutoIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M8 12L11 15L16 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const ChargeIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M13 2L4 14H11L9 22L18 10H13L13 2Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </Svg>
);
const ParkIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path
      d="M10 17V7H13.5C14.8807 7 16 8.11929 16 9.5V9.5C16 10.8807 14.8807 12 13.5 12H10"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const PhoneIcon = ({ color = "#111" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22 20.5 21.5 21 20.92 21C9.4 21 0 11.6 0 0.08C0 -0.5 0.5 -1 1.08 -1H4.08C4.66 -1 5.18 -0.65 5.32 -0.1C5.6 1.4 6.05 2.86 6.65 4.26C6.85 4.7 6.74 5.22 6.4 5.56L4.83 7.13C6.45 10.42 9.58 13.55 12.87 15.17L14.44 13.6C14.78 13.26 15.3 13.15 15.74 13.35C17.14 13.95 18.6 14.4 20.1 14.68C20.65 14.82 21 15.34 21 15.92"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="translate(1 2)"
    />
  </Svg>
);
const ChatIcon = ({ color = "#111" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M21 11.5C21 16.75 16.97 21 12 21C10.5 21 9.08 20.61 7.85 19.92L3 21L4.08 16.15C3.39 14.92 3 13.5 3 12C3 7.03 7.03 3 12 3C16.97 3 21 7.03 21 11.5Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const VerifiedIcon = ({ size = 14 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="#1E90FF">
    <Path
      d="M12 2L14.39 4.42L17.83 3.69L18.83 7.05L22.17 8.05L21.44 11.5L23.83 13.92L21.44 16.34L22.17 19.78L18.83 20.78L17.83 24.14L14.39 23.41L12 25.83L9.61 23.41L6.17 24.14L5.17 20.78L1.83 19.78L2.56 16.34L0.17 13.92L2.56 11.5L1.83 8.05L5.17 7.05L6.17 3.69L9.61 4.42L12 2Z"
      fill="#1E90FF"
      transform="scale(0.8) translate(3 -1)"
    />
    <Path
      d="M8 12L11 15L16 9"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const ArrowRight = ({ color = "#fff" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M5 12H19M19 12L12 5M19 12L12 19"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const FEATURES = [
  { label: "Capacity", value: "5 Seats", Icon: SeatIconSm },
  { label: "Engine Out", value: "670 HP", Icon: EngineIcon },
  { label: "Max Speed", value: "250km/h", Icon: SpeedIcon },
  { label: "Advance", value: "Autopilot", Icon: AutoIcon },
  { label: "Single Charge", value: "405 Miles", Icon: ChargeIcon },
  { label: "Advance", value: "Auto Parking", Icon: ParkIcon },
];

const PREVIEW_REVIEWS = [
  {
    id: 1,
    name: "Mr. Jack",
    rating: 5.0,
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "The rental car was clean, reliable, and the service was quick and efficient.",
  },
  {
    id: 2,
    name: "Robert",
    rating: 5.0,
    avatar: "https://i.pravatar.cc/100?img=13",
    text: "The rental car was clean, and the service was quick.",
  },
];

const CarDetailScreen = ({ navigation, route }) => {
  const car = route.params?.car || {
    name: "Tesla Model S",
    image:
      "https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=800&q=80",
  };
  const [favorite, setFavorite] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Car Details</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Car image */}
        <View style={styles.imageWrap}>
          <Image
            source={{ uri: car.image }}
            style={styles.carImage}
            resizeMode="contain"
          />
          <TouchableOpacity
            style={styles.favBtn}
            onPress={() => setFavorite(!favorite)}
          >
            <HeartIcon size={18} color="#111" filled={favorite} />
          </TouchableOpacity>
          <View style={styles.dots}>
            <View style={[styles.dot, styles.dotActive]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Title row */}
        <View style={styles.titleRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.carName}>{car.name}</Text>
            <Text style={styles.carDesc}>
              A car with high specs that are rented ot an affordable price.
            </Text>
          </View>
          <View style={styles.ratingBox}>
            <View style={styles.ratingRow}>
              <Text style={styles.ratingText}>5.0</Text>
              <StarIcon size={16} color="#FF9500" />
            </View>
            <Text style={styles.reviewsText}>(100+Reviews)</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Owner */}
        <View style={styles.ownerRow}>
          <Image
            source={{ uri: "https://i.pravatar.cc/100?img=47" }}
            style={styles.ownerAvatar}
          />
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <Text style={styles.ownerName}>Hela Quintin</Text>
            <View style={{ marginLeft: 4 }}>
              <VerifiedIcon size={14} />
            </View>
          </View>
          <View style={styles.ownerActions}>
            <TouchableOpacity style={styles.circleBtn}>
              <PhoneIcon color="#111" />
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.circleBtn, { marginLeft: 8 }]}
              onPress={() => navigation.navigate("ChatConversation")}
            >
              <ChatIcon color="#111" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Features */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Car features</Text>
          <View style={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <View key={i} style={styles.featureCard}>
                <View style={styles.featureIcon}>
                  <f.Icon color="#111" />
                </View>
                <Text style={styles.featureLabel}>{f.label}</Text>
                <Text style={styles.featureValue}>{f.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Reviews preview */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.sectionTitle}>Review (125)</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate("Reviews", { car })}
            >
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {PREVIEW_REVIEWS.map((r) => (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHead}>
                  <Image
                    source={{ uri: r.avatar }}
                    style={styles.reviewAvatar}
                  />
                  <Text style={styles.reviewerName}>{r.name}</Text>
                  <View style={styles.reviewRating}>
                    <Text style={styles.reviewerRating}>
                      {r.rating.toFixed(1)}
                    </Text>
                    <StarIcon size={12} color="#FF9500" />
                  </View>
                </View>
                <Text style={styles.reviewText} numberOfLines={2}>
                  {r.text}
                </Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </ScrollView>

      {/* Book Now */}
      <View style={styles.bookFooter}>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Booking", { car })}
        >
          <Text style={styles.bookBtnText}>Book Now</Text>
          <View style={{ marginLeft: 8 }}>
            <ArrowRight color="#fff" />
          </View>
        </TouchableOpacity>
      </View>
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
  imageWrap: {
    height: 240,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  carImage: { width: "100%", height: "85%" },
  favBtn: {
    position: "absolute",
    top: 10,
    right: 24,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  dots: {
    flexDirection: "row",
    position: "absolute",
    bottom: 4,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#D1D5DB",
    marginHorizontal: 3,
  },
  dotActive: { backgroundColor: "#111" },
  titleRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  carName: { fontSize: 19, fontWeight: "700", color: "#111", marginBottom: 4 },
  carDesc: { fontSize: 12, color: "#9CA3AF", lineHeight: 18 },
  ratingBox: { alignItems: "flex-end" },
  ratingRow: { flexDirection: "row", alignItems: "center" },
  ratingText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginRight: 4,
  },
  reviewsText: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 20,
    marginVertical: 16,
  },
  ownerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 6,
  },
  ownerAvatar: { width: 44, height: 44, borderRadius: 22, marginRight: 10 },
  ownerName: { fontSize: 14, fontWeight: "700", color: "#111" },
  ownerActions: { flexDirection: "row" },
  circleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  section: { paddingHorizontal: 20, marginTop: 16 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
  },
  seeAll: { fontSize: 13, color: "#9CA3AF" },
  featuresGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  featureCard: {
    width: "31%",
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  featureIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  featureLabel: { fontSize: 11, color: "#9CA3AF", marginBottom: 2 },
  featureValue: { fontSize: 12, color: "#111", fontWeight: "700" },
  reviewCard: {
    width: 280,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 12,
    marginRight: 10,
  },
  reviewHead: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  reviewAvatar: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  reviewerName: { fontSize: 13, fontWeight: "700", color: "#111", flex: 1 },
  reviewRating: { flexDirection: "row", alignItems: "center" },
  reviewerRating: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginRight: 3,
  },
  reviewText: { fontSize: 11, color: "#6B7280", lineHeight: 16 },
  bookFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
  },
  bookBtn: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  bookBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default CarDetailScreen;
