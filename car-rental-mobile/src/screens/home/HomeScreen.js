import React, { useState, useEffect, useCallback } from "react";
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
  RefreshControl,
} from "react-native";
import QentLogo from "../../components/common/QentLogo";
import {
  SearchIcon,
  FilterIcon,
  BellIcon,
  HeartIcon,
  StarIcon,
  LocationIcon,
  SeatIcon,
  DollarIcon,
} from "../../components/common/Icons";
import { CarService, FavoriteService } from "../../services";

// Brand logos statike (vetem dizajn, nuk kane nevoje per backend)
const BRAND_LOGOS = {
  Tesla: "https://logos-world.net/wp-content/uploads/2020/04/Tesla-Logo.png",
  Lamborghini:
    "https://logos-world.net/wp-content/uploads/2020/04/Lamborghini-Logo.png",
  BMW: "https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png",
  Ferrari:
    "https://logos-world.net/wp-content/uploads/2020/04/Ferrari-Logo.png",
  "Mercedes-Benz":
    "https://logos-world.net/wp-content/uploads/2020/04/Mercedes-Benz-Logo.png",
  Audi: "https://logos-world.net/wp-content/uploads/2020/04/Audi-Logo.png",
};

const fallbackImg =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80";

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState("");
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState({});

  useEffect(() => {
    loadData();
  }, []);

  // Merr makinat dhe brand-et nga backend
  const loadData = async () => {
    try {
      const [carsRes, brandsRes] = await Promise.all([
        CarService.getAll(),
        CarService.getBrands(),
      ]);
      setCars(carsRes.data || []);
      setBrands(brandsRes.data || []);
    } catch (e) {
      console.error("Home load error:", e.message);
      setCars([]);
      setBrands([]);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  };

  const toggleFavorite = async (carId) => {
    setFavorites((prev) => ({ ...prev, [carId]: !prev[carId] }));
    try {
      await FavoriteService.toggle(carId);
    } catch (e) {
      // Nese deshton, kthe mbrapa
      setFavorites((prev) => ({ ...prev, [carId]: !prev[carId] }));
    }
  };

  // Ndaj makinat: 4 te parat per "Best Cars", pjesa per "Nearby"
  const bestCars = cars.slice(0, 6);
  const nearbyCars = cars.slice(6, 9);

  const renderCarCard = (car) => {
    const img = car.primary_image || car.image || fallbackImg;
    const brandName = car.brand_name || "";
    const displayName = `${brandName} ${car.model || car.name || ""}`.trim();
    return (
      <TouchableOpacity
        key={car.id}
        style={styles.carCard}
        activeOpacity={0.85}
        onPress={() =>
          navigation.navigate("CarDetail", {
            car: { ...car, name: displayName, image: img },
          })
        }
      >
        <View style={styles.carImageWrapper}>
          <Image
            source={{ uri: img }}
            style={styles.carImage}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.heartBtn}
            onPress={() => toggleFavorite(car.id)}
          >
            <HeartIcon size={16} color="#111" filled={!!favorites[car.id]} />
          </TouchableOpacity>
        </View>
        <View style={styles.carInfo}>
          <Text style={styles.carName} numberOfLines={1}>
            {displayName || "Car"}
          </Text>
          <View style={styles.ratingRow}>
            <Text style={styles.ratingText}>
              {(car.average_rating
                ? parseFloat(car.average_rating)
                : 5.0
              ).toFixed(1)}
            </Text>
            <StarIcon size={12} color="#FF9500" />
          </View>
          <View style={styles.locationRow}>
            <LocationIcon size={12} color="#9CA3AF" />
            <Text style={styles.locationText} numberOfLines={1}>
              {car.address || car.location || "Available"}
            </Text>
          </View>
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <SeatIcon size={12} color="#9CA3AF" />
              <Text style={styles.metaText}>{car.seats || 5} Seats</Text>
            </View>
            <View style={styles.metaItem}>
              <DollarIcon size={12} color="#9CA3AF" />
              <Text style={styles.metaText}>
                ${car.price_per_day || car.price || 0}/Day
              </Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <QentLogo size={42} bg="black" fg="white" />
          <Text style={styles.brandName}>Qent</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellBtn}
            onPress={() => navigation.navigate("Notifications")}
          >
            <BellIcon size={22} color="#111" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate("Profile")}>
            <Image
              source={{ uri: "https://i.pravatar.cc/100?img=12" }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
      </View>

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Search */}
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <SearchIcon size={18} color="#9CA3AF" />
              <TextInput
                placeholder="Search your dream car....."
                placeholderTextColor="#9CA3AF"
                style={styles.searchInput}
                value={searchText}
                onChangeText={setSearchText}
                onFocus={() => navigation.navigate("Search")}
              />
            </View>
            <TouchableOpacity
              style={styles.filterBtn}
              onPress={() => navigation.navigate("Filters")}
            >
              <FilterIcon size={20} color="#111" />
            </TouchableOpacity>
          </View>

          {/* Brands */}
          {brands.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Brands</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 14 }}
              >
                {brands.map((brand) => (
                  <TouchableOpacity key={brand.id} style={styles.brandItem}>
                    <View style={styles.brandCircle}>
                      {BRAND_LOGOS[brand.name] ? (
                        <Image
                          source={{ uri: BRAND_LOGOS[brand.name] }}
                          style={styles.brandLogo}
                          resizeMode="contain"
                        />
                      ) : (
                        <Text style={styles.brandInitial}>{brand.name[0]}</Text>
                      )}
                    </View>
                    <Text style={styles.brandLabel}>{brand.name}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Best Cars */}
          <View style={styles.bestCarsCard}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>Best Cars</Text>
                <Text style={styles.subText}>Available</Text>
              </View>
              <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                <Text style={styles.viewAll}>View All</Text>
              </TouchableOpacity>
            </View>

            {bestCars.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {bestCars.map(renderCarCard)}
              </ScrollView>
            ) : (
              <Text style={styles.emptyText}>
                S'ka makina ende. Shto makina ne databaze.
              </Text>
            )}
          </View>

          {/* Nearby */}
          {nearbyCars.length > 0 && (
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Nearby</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Search")}>
                  <Text style={styles.viewAll}>View All</Text>
                </TouchableOpacity>
              </View>
              {nearbyCars.map((car) => {
                const img = car.primary_image || car.image || fallbackImg;
                const displayName =
                  `${car.brand_name || ""} ${car.model || ""}`.trim();
                return (
                  <TouchableOpacity
                    key={car.id}
                    style={styles.nearbyCard}
                    activeOpacity={0.85}
                    onPress={() =>
                      navigation.navigate("CarDetail", {
                        car: { ...car, name: displayName, image: img },
                      })
                    }
                  >
                    <Image
                      source={{ uri: img }}
                      style={styles.nearbyImage}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
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
    paddingVertical: 12,
    backgroundColor: "#F5F5F5",
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  brandRow: { flexDirection: "row", alignItems: "center" },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 10,
  },
  headerRight: { flexDirection: "row", alignItems: "center" },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  badge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#111",
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 3,
  },
  badgeText: { color: "#fff", fontSize: 10, fontWeight: "bold" },
  avatar: { width: 40, height: 40, borderRadius: 20 },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    marginTop: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: "#111", marginLeft: 10 },
  filterBtn: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 10,
  },
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
  subText: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  viewAll: { fontSize: 14, color: "#9CA3AF" },
  brandItem: { alignItems: "center", marginRight: 20 },
  brandCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#111",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  brandLogo: { width: 38, height: 38, tintColor: "#fff" },
  brandInitial: { color: "#fff", fontSize: 24, fontWeight: "bold" },
  brandLabel: { fontSize: 12, color: "#6B7280" },
  bestCarsCard: {
    backgroundColor: "#fff",
    marginTop: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  carCard: {
    width: 220,
    backgroundColor: "#F8F8F8",
    borderRadius: 16,
    marginRight: 12,
    overflow: "hidden",
  },
  carImageWrapper: {
    height: 130,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  carImage: { width: "100%", height: "100%" },
  heartBtn: {
    position: "absolute",
    top: 10,
    right: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  carInfo: { padding: 12 },
  carName: { fontSize: 15, fontWeight: "700", color: "#111", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  ratingText: {
    fontSize: 13,
    color: "#111",
    marginRight: 4,
    fontWeight: "600",
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  locationText: { fontSize: 12, color: "#9CA3AF", marginLeft: 4, flex: 1 },
  metaRow: { flexDirection: "row", justifyContent: "space-between" },
  metaItem: { flexDirection: "row", alignItems: "center" },
  metaText: { fontSize: 11, color: "#6B7280", marginLeft: 4 },
  nearbyCard: {
    height: 180,
    backgroundColor: "#E8E8E8",
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  nearbyImage: { width: "100%", height: "100%" },
  emptyText: {
    color: "#9CA3AF",
    fontSize: 13,
    paddingVertical: 20,
    textAlign: "center",
  },
});

export default HomeScreen;
