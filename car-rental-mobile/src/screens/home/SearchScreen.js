import React, { useState } from 'react';
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
} from 'react-native';
import {
  SearchIcon, FilterIcon, HeartIcon, StarIcon,
  LocationIcon, BackIcon, MoreIcon,
} from '../../components/common/Icons';

const FILTERS = [
  { id: 'all', name: 'ALL', logo: null },
  { id: 'ferrari', name: 'Ferrari', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Ferrari-Logo.png' },
  { id: 'tesla', name: 'Tesla', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Tesla-Logo.png' },
  { id: 'bmw', name: 'BMW', logo: 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png' },
  { id: 'lambo', name: 'Lambo', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Lamborghini-Logo.png' },
];

const CARS = [
  {
    id: 1,
    name: 'Tesla Model S',
    rating: 5.0,
    location: 'Chicago, USA',
    price: 100,
    brand: 'tesla',
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
  },
  {
    id: 2,
    name: 'Ferrari LaFerrari',
    rating: 5.0,
    location: 'Washington DC',
    price: 100,
    brand: 'ferrari',
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80',
  },
  {
    id: 3,
    name: 'Lamborghini Aventador',
    rating: 4.9,
    location: 'Washington DC',
    price: 100,
    brand: 'lambo',
    image: 'https://images.unsplash.com/photo-1631295868223-63265b40d9e4?w=600&q=80',
  },
  {
    id: 4,
    name: 'BMW GTS3 M2',
    rating: 5.0,
    location: 'New York, USA',
    price: 100,
    brand: 'bmw',
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80',
  },
];

const POPULAR = [
  {
    id: 5,
    name: 'Ferrari LaFerrari',
    rating: 5.0,
    price: 100,
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=400&q=80',
  },
  {
    id: 6,
    name: 'BMW M8',
    rating: 4.9,
    price: 180,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=400&q=80',
  },
];

const SearchScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredCars = selectedFilter === 'all'
    ? CARS
    : CARS.filter((c) => c.brand === selectedFilter);

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
        <Text style={styles.headerTitle}>Search</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Search bar */}
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <SearchIcon size={18} color="#9CA3AF" />
            <TextInput
              placeholder="Search your dream car....."
              placeholderTextColor="#9CA3AF"
              style={styles.searchInput}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <FilterIcon size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Brand filter chips */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsRow}
        >
          {FILTERS.map((f) => {
            const active = selectedFilter === f.id;
            return (
              <TouchableOpacity
                key={f.id}
                style={[styles.chip, active && styles.chipActive]}
                onPress={() => setSelectedFilter(f.id)}
              >
                {f.logo ? (
                  <Image source={{ uri: f.logo }} style={styles.chipLogo} resizeMode="contain" />
                ) : (
                  <View style={[styles.chipDot, active && { backgroundColor: '#fff' }]} />
                )}
                <Text style={[styles.chipText, active && styles.chipTextActive]}>
                  {f.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Recommended */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recommend For You</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {filteredCars.map((car) => (
              <TouchableOpacity
                key={car.id}
                style={styles.carCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CarDetail', { car })}
              >
                <View style={styles.carImageWrapper}>
                  <Image source={{ uri: car.image }} style={styles.carImage} resizeMode="contain" />
                  <TouchableOpacity
                    style={styles.heartBtn}
                    onPress={() => toggleFavorite(car.id)}
                  >
                    <HeartIcon size={14} color="#111" filled={!!favorites[car.id]} />
                  </TouchableOpacity>
                </View>
                <View style={styles.carInfo}>
                  <Text style={styles.carName}>{car.name}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>{car.rating.toFixed(1)}</Text>
                    <StarIcon size={11} color="#FF9500" />
                  </View>
                  <View style={styles.locationRow}>
                    <LocationIcon size={11} color="#9CA3AF" />
                    <Text style={styles.locationText}>{car.location}</Text>
                  </View>
                  <View style={styles.priceRow}>
                    <Text style={styles.priceText}>${car.price}/Day</Text>
                    <TouchableOpacity style={styles.bookBtn}>
                      <Text style={styles.bookText}>Book now</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Popular */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Our Popular Cars</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {POPULAR.map((car) => (
              <TouchableOpacity
                key={car.id}
                style={styles.popularCard}
                activeOpacity={0.85}
                onPress={() => navigation.navigate('CarDetail', { car })}
              >
                <Image source={{ uri: car.image }} style={styles.popularImage} resizeMode="contain" />
                <View style={styles.popularInfo}>
                  <Text style={styles.popularName}>{car.name}</Text>
                  <View style={styles.ratingRow}>
                    <Text style={styles.ratingText}>{car.rating.toFixed(1)}</Text>
                    <StarIcon size={11} color="#FF9500" />
                  </View>
                  <Text style={styles.priceText}>${car.price}/Day</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  iconBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  searchRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 20, marginTop: 16,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16, paddingVertical: 14,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111', marginLeft: 10 },
  filterBtn: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    marginLeft: 10,
  },
  chipsRow: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 30,
    marginRight: 10,
  },
  chipActive: { backgroundColor: '#2D2D2D' },
  chipLogo: { width: 18, height: 18, marginRight: 6 },
  chipDot: {
    width: 18, height: 18, borderRadius: 9,
    backgroundColor: '#2D2D2D', marginRight: 6,
  },
  chipText: { fontSize: 13, color: '#6B7280', fontWeight: '600' },
  chipTextActive: { color: '#fff' },
  section: { paddingHorizontal: 20, marginTop: 8 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111' },
  viewAll: { fontSize: 13, color: '#9CA3AF' },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  carCard: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
  },
  carImageWrapper: {
    height: 100,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center', alignItems: 'center',
    padding: 8,
  },
  carImage: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 8, right: 8,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  carInfo: { padding: 10 },
  carName: { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  ratingText: { fontSize: 12, color: '#111', marginRight: 3, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { fontSize: 11, color: '#9CA3AF', marginLeft: 3 },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceText: { fontSize: 12, fontWeight: '700', color: '#111' },
  bookBtn: {
    backgroundColor: '#2D2D2D',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  bookText: { color: '#fff', fontSize: 10, fontWeight: '600' },
  popularCard: {
    width: 200,
    backgroundColor: '#fff',
    borderRadius: 14,
    marginRight: 12,
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  popularImage: { width: 70, height: 50, marginRight: 10 },
  popularInfo: { flex: 1 },
  popularName: { fontSize: 13, fontWeight: '700', color: '#111', marginBottom: 4 },
});

export default SearchScreen;