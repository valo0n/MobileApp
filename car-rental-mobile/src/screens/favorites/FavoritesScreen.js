import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { BackIcon, HeartIcon, StarIcon } from "../../components/common/Icons";
import { useFavoritesViewModel } from "../../viewmodels";

const FALLBACK_IMG =
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80";

const FavoritesScreen = ({ navigation }) => {
  const { favorites, load, toggle } = useFavoritesViewModel();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      await load();
    } catch (e) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [load]);

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

  const openCar = (item) => {
    const name = `${item.brand_name || ""} ${item.model || ""}`.trim();
    navigation.navigate("CarDetail", {
      car: {
        id: item.car_id,
        ...item,
        name,
        image: item.primary_image || FALLBACK_IMG,
      },
    });
  };

  const removeFav = async (carId) => {
    try {
      await toggle(carId);
    } catch (e) {}
  };

  const renderCard = (item) => {
    const name = `${item.brand_name || ""} ${item.model || ""}`.trim();
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => openCar(item)}
      >
        <Image
          source={{ uri: item.primary_image || FALLBACK_IMG }}
          style={styles.image}
        />
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={() => removeFav(item.car_id)}
        >
          <HeartIcon size={18} color="#EF4444" filled />
        </TouchableOpacity>

        <View style={styles.cardBody}>
          <View style={{ flex: 1 }}>
            <Text style={styles.carName} numberOfLines={1}>
              {name || "Car"}
            </Text>
            <View style={styles.ratingRow}>
              <StarIcon size={13} color="#FF9500" />
              <Text style={styles.ratingText}>
                {item.average_rating
                  ? parseFloat(item.average_rating).toFixed(1)
                  : "New"}
              </Text>
            </View>
          </View>
          <Text style={styles.price}>${item.price_per_day || 0}/Day</Text>
        </View>
      </TouchableOpacity>
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
        <Text style={styles.headerTitle}>Favorite Cars</Text>
        <View style={{ width: 40 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      ) : favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyEmoji}>🤍</Text>
          <Text style={styles.emptyTitle}>No favorites yet</Text>
          <Text style={styles.emptySub}>
            Tap the heart on any car to save it here.
          </Text>
          <TouchableOpacity
            style={styles.browseBtn}
            onPress={() => navigation.navigate("MainTabs", { screen: "Home" })}
          >
            <Text style={styles.browseText}>Browse cars</Text>
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
          {favorites.map(renderCard)}
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
  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  image: { width: "100%", height: 160, backgroundColor: "#EEE" },
  heartBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
  },
  cardBody: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
  },
  carName: { fontSize: 16, fontWeight: "700", color: "#111" },
  ratingRow: { flexDirection: "row", alignItems: "center", marginTop: 4 },
  ratingText: { fontSize: 13, color: "#6B7280", marginLeft: 4 },
  price: { fontSize: 15, fontWeight: "700", color: "#111" },
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

export default FavoritesScreen;
