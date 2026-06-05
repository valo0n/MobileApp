import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  BackIcon,
  MoreIcon,
  SearchIcon,
  StarIcon,
} from "../../components/common/Icons";
import { ReviewService } from "../../services";

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

const FALLBACK_AVATAR = "https://i.pravatar.cc/100?img=8";

const timeAgo = (d) => {
  if (!d) return "";
  const diff = Date.now() - new Date(d).getTime();
  const day = Math.floor(diff / 86400000);
  if (day <= 0) return "Today";
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day} days ago`;
  if (day < 30) return `${Math.floor(day / 7)} week(s) ago`;
  return new Date(d).toLocaleDateString();
};

const ReviewsScreen = ({ navigation, route }) => {
  const car = route.params?.car;
  const carId = car?.id;

  const [search, setSearch] = useState("");
  const [reviews, setReviews] = useState([]);
  const [stats, setStats] = useState({ avg_rating: 0, total_reviews: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const load = async () => {
      if (!carId) {
        setLoading(false);
        return;
      }
      try {
        const res = await ReviewService.getByCar(carId);
        if (!active) return;
        setReviews(res.data?.reviews || []);
        setStats(res.data?.stats || { avg_rating: 0, total_reviews: 0 });
      } catch (e) {
        if (active) setReviews([]);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => {
      active = false;
    };
  }, [carId]);

  const avg = parseFloat(stats?.avg_rating || 0);
  const total = stats?.total_reviews || 0;

  const filtered = reviews.filter((r) => {
    const name = `${r.first_name || ""} ${r.last_name || ""}`.toLowerCase();
    const text = (r.comment || "").toLowerCase();
    const q = search.toLowerCase();
    return name.includes(q) || text.includes(q);
  });

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
        <Text style={styles.headerTitle}>Reviews</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Rating header */}
        <View style={styles.ratingHead}>
          <StarIcon size={22} color="#FF9500" />
          <Text style={styles.ratingHeadText}>
            {total > 0
              ? `${avg.toFixed(1)} Reviews (${total})`
              : "No reviews yet"}
          </Text>
        </View>

        {/* Search */}
        <View style={styles.searchBox}>
          <SearchIcon size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Find reviews........."
            placeholderTextColor="#9CA3AF"
            style={styles.searchInput}
            value={search}
            onChangeText={setSearch}
          />
        </View>

        {loading ? (
          <ActivityIndicator
            size="large"
            color="#111"
            style={{ marginTop: 40 }}
          />
        ) : filtered.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>💬</Text>
            <Text style={styles.emptyTitle}>No reviews yet</Text>
            <Text style={styles.emptySub}>
              Be the first to rent and review this car.
            </Text>
          </View>
        ) : (
          filtered.map((r) => {
            const name =
              `${r.first_name || ""} ${r.last_name || ""}`.trim() || "User";
            const stars = Math.round(r.rating || 0);
            return (
              <View key={r.id} style={styles.reviewCard}>
                <View style={styles.reviewHead}>
                  <Image
                    source={{ uri: r.avatar_url || FALLBACK_AVATAR }}
                    style={styles.avatar}
                  />
                  <Text style={styles.name}>{name}</Text>
                  <Text style={styles.when}>{timeAgo(r.created_at)}</Text>
                </View>

                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((s) => (
                    <View key={s} style={{ marginRight: 2 }}>
                      <StarIcon
                        size={16}
                        color={s <= stars ? "#FF9500" : "#E5E7EB"}
                      />
                    </View>
                  ))}
                </View>

                {!!r.comment && (
                  <Text style={styles.reviewText}>{r.comment}</Text>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Book Now */}
      <View style={styles.footer}>
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
  ratingHead: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  ratingHeadText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginLeft: 8,
  },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
  },
  searchInput: { flex: 1, fontSize: 13, color: "#111", marginLeft: 10 },
  reviewCard: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 14,
    padding: 14,
  },
  reviewHead: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  avatar: { width: 36, height: 36, borderRadius: 18, marginRight: 10 },
  name: { fontSize: 14, fontWeight: "700", color: "#111", flex: 1 },
  when: { fontSize: 12, color: "#9CA3AF" },
  starsRow: { flexDirection: "row", marginBottom: 8 },
  reviewText: { fontSize: 12, color: "#6B7280", lineHeight: 18 },
  empty: { alignItems: "center", paddingTop: 50, paddingHorizontal: 30 },
  emptyEmoji: { fontSize: 40, marginBottom: 10 },
  emptyTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  emptySub: {
    fontSize: 13,
    color: "#9CA3AF",
    textAlign: "center",
    marginTop: 6,
  },
  footer: {
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

export default ReviewsScreen;
