import React, { useState } from "react";
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
} from "react-native";
import Svg, { Path } from "react-native-svg";
import {
  BackIcon,
  MoreIcon,
  SearchIcon,
  StarIcon,
} from "../../components/common/Icons";

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

const REVIEWS = [
  {
    id: 1,
    name: "Mr. Jack",
    stars: 5,
    when: "Today",
    avatar: "https://i.pravatar.cc/100?img=12",
    text: "The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.",
  },
  {
    id: 2,
    name: "Robert",
    stars: 5,
    when: "Yesterday",
    avatar: "https://i.pravatar.cc/100?img=13",
    text: "The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.",
  },
  {
    id: 3,
    name: "Juliea",
    stars: 5,
    when: "2 Weekes ago",
    avatar: "https://i.pravatar.cc/100?img=45",
    text: "The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.",
  },
  {
    id: 4,
    name: "Mr. Jon",
    stars: 5,
    when: "3 Weekes ago",
    avatar: "https://i.pravatar.cc/100?img=33",
    text: "The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.",
  },
  {
    id: 5,
    name: "Hanrick",
    stars: 3,
    when: "3 Weekes ago",
    avatar: "https://i.pravatar.cc/100?img=15",
    text: "The rental car was clean, reliable, and the service was quick and efficient. Overall, the experience was hassle-free and enjoyable.",
  },
];

const ReviewsScreen = ({ navigation, route }) => {
  const [search, setSearch] = useState("");

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
          <Text style={styles.ratingHeadText}>5.0 Reviews (125)</Text>
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

        {/* Reviews */}
        {REVIEWS.map((r) => (
          <View key={r.id} style={styles.reviewCard}>
            <View style={styles.reviewHead}>
              <Image source={{ uri: r.avatar }} style={styles.avatar} />
              <Text style={styles.name}>{r.name}</Text>
              <Text style={styles.when}>{r.when}</Text>
            </View>

            <View style={styles.starsRow}>
              {[1, 2, 3, 4, 5].map((s) => (
                <View key={s} style={{ marginRight: 2 }}>
                  <StarIcon
                    size={16}
                    color={s <= r.stars ? "#FF9500" : "#E5E7EB"}
                  />
                </View>
              ))}
            </View>

            <Text style={styles.reviewText}>{r.text}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Book Now */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.navigate("Booking", { car: route.params?.car })
          }
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
