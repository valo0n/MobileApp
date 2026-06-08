import React, { useState, useEffect, useCallback, memo } from "react";
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
import {
  SearchIcon,
  FilterIcon,
  HeartIcon,
  StarIcon,
  LocationIcon,
  BackIcon,
  MoreIcon,
} from "../../components/common/Icons";
import { CarService, FavoriteService } from "../../services";

const fallbackImg =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=400&q=60";

const CarGridCard = memo(({ car, isFav, onPress, onFav }) => {
  const img = car.primary_image || fallbackImg;
  const name = `${car.brand_name || ""} ${car.model || ""}`.trim();
  return (
    <TouchableOpacity
      style={styles.carCard}
      activeOpacity={0.85}
      onPress={onPress}
    >
      <View style={styles.carImageWrapper}>
        <Image
          source={{ uri: img }}
          style={styles.carImage}
          resizeMode="cover"
          fadeDuration={0}
        />
        <TouchableOpacity style={styles.heartBtn} onPress={onFav}>
          <HeartIcon size={14} color="#111" filled={isFav} />
        </TouchableOpacity>
      </View>
      <View style={styles.carInfo}>
        <Text style={styles.carName} numberOfLines={1}>
          {name || "Car"}
        </Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>
            {(car.average_rating
              ? parseFloat(car.average_rating)
              : 5.0
            ).toFixed(1)}
          </Text>
          <StarIcon size={11} color="#FF9500" />
        </View>
        <View style={styles.locationRow}>
          <LocationIcon size={11} color="#9CA3AF" />
          <Text style={styles.locationText} numberOfLines={1}>
            {car.address || "Available"}
          </Text>
        </View>
        <View style={styles.priceRow}>
          <Text style={styles.priceText}>${car.price_per_day || 0}/Day</Text>
          <TouchableOpacity style={styles.bookBtn} onPress={onPress}>
            <Text style={styles.bookText}>Book now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
});

const SearchScreen = ({ navigation, route }) => {
  const [searchText, setSearchText] = useState("");
  const [cars, setCars] = useState([]);
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeFilters, setActiveFilters] = useState(null);

  // Kur vijne filtra te ri nga Filters screen, apliko
  useEffect(() => {
    if (route.params?.filters) {
      setActiveFilters(route.params.filters);
      loadData(route.params.filters);
    } else {
      loadData({});
    }
  }, [route.params?.filters]);

  useEffect(() => {
    // Ngarko brand-et nje here
    CarService.getBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() => {});
  }, []);

  const loadData = async (filters = {}) => {
    setLoading(true);
    try {
      const carsRes = await CarService.getAll(filters);
      setCars(carsRes.data || []);
    } catch (e) {
      console.error("Search load error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleFavorite = useCallback(async (carId) => {
    setFavorites((prev) => ({ ...prev, [carId]: !prev[carId] }));
    try {
      await FavoriteService.toggle(carId);
    } catch (e) {
      setFavorites((prev) => ({ ...prev, [carId]: !prev[carId] }));
    }
  }, []);

  const openCar = useCallback(
    (car) => {
      const img = car.primary_image || fallbackImg;
      const name = `${car.brand_name || ""} ${car.model || ""}`.trim();
      navigation.navigate("CarDetail", { car: { ...car, name, image: img } });
    },
    [navigation],
  );

  // Filtrim shtese ne frontend (brand chip + tekst)
  const filtered = cars.filter((car) => {
    const matchBrand =
      selectedBrand === "all" || car.brand_id === selectedBrand;
    const fullName = `${car.brand_name || ""} ${car.model || ""}`.toLowerCase();
    const matchSearch = fullName.includes(searchText.toLowerCase());
    return matchBrand && matchSearch;
  });

  const popular = cars.slice(0, 5);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.navigate("Home")}
        >
          <BackIcon size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
        removeClippedSubviews
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
            />
          </View>
          <TouchableOpacity
            style={styles.filterBtn}
            onPress={() => navigation.navigate("Filters")}
          >
            <FilterIcon size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Active filters indicator */}
        {activeFilters && Object.keys(activeFilters).length > 0 && (
          <View style={styles.filterBanner}>
            <Text style={styles.filterBannerText}>
              Filtra aktive: {Object.keys(activeFilters).length}
            </Text>
            <TouchableOpacity
              onPress={() => {
                setActiveFilters(null);
                loadData({});
              }}
            >
              <Text style={styles.clearFilterText}>Pastro</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Brand chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          <TouchableOpacity
            style={[styles.chip, selectedBrand === "all" && styles.chipActive]}
            onPress={() => setSelectedBrand("all")}
          >
            <View
              style={[
                styles.chipDot,
                selectedBrand === "all" && { backgroundColor: "#fff" },
              ]}
            />
            <Text
              style={[
                styles.chipText,
                selectedBrand === "all" && styles.chipTextActive,
              ]}
            >
              ALL
            </Text>
          </TouchableOpacity>
          {brands.map((b) => {
            const active = selectedBrand === b.id;
            return (
              <TouchableOpacity
                key={b.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedBrand(b.id)}
              >
                {b.logo_url ? (
                  <Image
                    source={{ uri: b.logo_url }}
                    style={styles.chipLogo}
                    resizeMode="contain"
                    fadeDuration={0}
                  />
                ) : (
                  <View
                    style={[
                      styles.chipDot,
                      active && { backgroundColor: "#fff" },
                    ]}
                  />
                )}
                <Text
                  style={[styles.chipText, active && styles.chipTextActive]}
                >
                  {b.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {loading ? (
          <View style={styles.loadingWrap}>
            <ActivityIndicator size="large" color="#111" />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Recommend For You</Text>
                <Text style={styles.viewAll}>View All</Text>
              </View>
              {filtered.length > 0 ? (
                <View style={styles.grid}>
                  {filtered.map((car) => (
                    <CarGridCard
                      key={car.id}
                      car={car}
                      isFav={!!favorites[car.id]}
                      onPress={() => openCar(car)}
                      onFav={() => toggleFavorite(car.id)}
                    />
                  ))}
                </View>
              ) : (
                <Text style={styles.emptyText}>
                  {searchText
                    ? `S'u gjet asgje per "${searchText}"`
                    : "S'ka makina qe perputhen me filtrat"}
                </Text>
              )}
            </View>

            {popular.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Our Popular Cars</Text>
                  <Text style={styles.viewAll}>View All</Text>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  removeClippedSubviews
                >
                  {popular.map((car) => {
                    const img = car.primary_image || fallbackImg;
                    const name =
                      `${car.brand_name || ""} ${car.model || ""}`.trim();
                    return (
                      <TouchableOpacity
                        key={car.id}
                        style={styles.popularCard}
                        activeOpacity={0.85}
                        onPress={() => openCar(car)}
                      >
                        <Image
                          source={{ uri: img }}
                          style={styles.popularImage}
                          resizeMode="cover"
                          fadeDuration={0}
                        />
                        <View style={styles.popularInfo}>
                          <Text style={styles.popularName} numberOfLines={1}>
                            {name}
                          </Text>
                          <View style={styles.ratingRow}>
                            <Text style={styles.ratingText}>
                              {(car.average_rating
                                ? parseFloat(car.average_rating)
                                : 5.0
                              ).toFixed(1)}
                            </Text>
                            <StarIcon size={11} color="#FF9500" />
                          </View>
                          <Text style={styles.priceText}>
                            ${car.price_per_day || 0}/Day
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </View>
            )}
          </>
        )}
      </ScrollView>
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
  headerTitle: { fontSize: 18, fontWeight: "700", color: "#111" },
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
  filterBanner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 20,
    marginTop: 12,
    backgroundColor: "#111",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  filterBannerText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  clearFilterText: {
    color: "#fff",
    fontSize: 13,
    textDecorationLine: "underline",
  },
  chipsRow: { paddingHorizontal: 20, paddingVertical: 16 },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
  },
  chipActive: { backgroundColor: "#2D2D2D" },
  chipLogo: { width: 18, height: 18, marginRight: 6 },
  chipDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: "#2D2D2D",
    marginRight: 6,
  },
  chipText: { fontSize: 13, color: "#6B7280", fontWeight: "600" },
  chipTextActive: { color: "#fff" },
  loadingWrap: { paddingVertical: 60, alignItems: "center" },
  section: { paddingHorizontal: 20, marginTop: 8 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  viewAll: { fontSize: 13, color: "#9CA3AF" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  carCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 14,
    overflow: "hidden",
  },
  carImageWrapper: {
    height: 100,
    backgroundColor: "#E8E8E8",
    justifyContent: "center",
    alignItems: "center",
  },
  carImage: { width: "100%", height: "100%" },
  heartBtn: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  carInfo: { padding: 10 },
  carName: { fontSize: 13, fontWeight: "700", color: "#111", marginBottom: 4 },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  ratingText: {
    fontSize: 12,
    color: "#111",
    marginRight: 3,
    fontWeight: "600",
  },
  locationRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  locationText: { fontSize: 11, color: "#9CA3AF", marginLeft: 3, flex: 1 },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceText: { fontSize: 12, fontWeight: "700", color: "#111" },
  bookBtn: {
    backgroundColor: "#2D2D2D",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookText: { color: "#fff", fontSize: 10, fontWeight: "600" },
  popularCard: {
    width: 200,
    backgroundColor: "#fff",
    borderRadius: 14,
    marginRight: 12,
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  popularImage: { width: 70, height: 50, borderRadius: 8, marginRight: 10 },
  popularInfo: { flex: 1 },
  popularName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 4,
  },
  emptyText: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 13,
    paddingVertical: 30,
  },
});

export default SearchScreen;
