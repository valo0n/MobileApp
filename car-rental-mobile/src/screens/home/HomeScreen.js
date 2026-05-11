import React, { useState, useEffect } from 'react';
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
  FlatList,
} from 'react-native';
import QentLogo from '../../components/common/QentLogo';
import {
  SearchIcon, FilterIcon, BellIcon, HeartIcon,
  StarIcon, LocationIcon, SeatIcon, DollarIcon,
} from '../../components/common/Icons';

// Brand logos (Wikipedia / CDN sources)
const BRANDS = [
  { id: 1, name: 'Tesla', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Tesla-Logo.png' },
  { id: 2, name: 'Lamborghini', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Lamborghini-Logo.png' },
  { id: 3, name: 'BMW', logo: 'https://logos-world.net/wp-content/uploads/2020/04/BMW-Logo.png' },
  { id: 4, name: 'Ferrari', logo: 'https://logos-world.net/wp-content/uploads/2020/04/Ferrari-Logo.png' },
];

// Mock cars data — replace with API call later
const BEST_CARS = [
  {
    id: 1,
    name: 'Ferrari-FF',
    rating: 5.0,
    location: 'Washington DC',
    seats: 4,
    price: 200,
    image: 'https://images.unsplash.com/photo-1592198084033-aade902d1aae?w=600&q=80',
  },
  {
    id: 2,
    name: 'Tesla Model S',
    rating: 5.0,
    location: 'Chicago, USA',
    seats: 5,
    price: 100,
    image: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=600&q=80',
  },
];

const NEARBY_CARS = [
  {
    id: 3,
    name: 'BMW M8',
    rating: 4.8,
    location: 'New York, USA',
    seats: 4,
    price: 180,
    image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80',
  },
];

const HomeScreen = ({ navigation }) => {
  const [searchText, setSearchText] = useState('');
  const [favorites, setFavorites] = useState({});

  const toggleFavorite = (id) => {
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderCarCard = (car) => (
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
          <HeartIcon size={16} color="#111" filled={!!favorites[car.id]} />
        </TouchableOpacity>
      </View>
      <View style={styles.carInfo}>
        <Text style={styles.carName}>{car.name}</Text>
        <View style={styles.ratingRow}>
          <Text style={styles.ratingText}>{car.rating.toFixed(1)}</Text>
          <StarIcon size={12} color="#FF9500" />
        </View>
        <View style={styles.locationRow}>
          <LocationIcon size={12} color="#9CA3AF" />
          <Text style={styles.locationText}>{car.location}</Text>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <SeatIcon size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>{car.seats} Seats</Text>
          </View>
          <View style={styles.metaItem}>
            <DollarIcon size={12} color="#9CA3AF" />
            <Text style={styles.metaText}>${car.price}/Day</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

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
            onPress={() => navigation.navigate('Notifications')}
          >
            <BellIcon size={22} color="#111" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>2</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
            <Image
              source={{ uri: 'https://i.pravatar.cc/100?img=12' }}
              style={styles.avatar}
            />
          </TouchableOpacity>
        </View>
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
              onFocus={() => navigation.navigate('Search')}
            />
          </View>
          <TouchableOpacity style={styles.filterBtn}>
            <FilterIcon size={20} color="#111" />
          </TouchableOpacity>
        </View>

        {/* Brands */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brands</Text>
          <View style={styles.brandsRow}>
            {BRANDS.map((brand) => (
              <TouchableOpacity key={brand.id} style={styles.brandItem}>
                <View style={styles.brandCircle}>
                  <Image source={{ uri: brand.logo }} style={styles.brandLogo} resizeMode="contain" />
                </View>
                <Text style={styles.brandLabel}>{brand.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Best Cars */}
        <View style={styles.bestCarsCard}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Best Cars</Text>
              <Text style={styles.subText}>Available</Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {BEST_CARS.map(renderCarCard)}
          </ScrollView>
        </View>

        {/* Nearby */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Nearby</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>
          {NEARBY_CARS.map((car) => (
            <TouchableOpacity
              key={car.id}
              style={styles.nearbyCard}
              activeOpacity={0.85}
              onPress={() => navigation.navigate('CarDetail', { car })}
            >
              <Image source={{ uri: car.image }} style={styles.nearbyImage} resizeMode="contain" />
            </TouchableOpacity>
          ))}
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
    backgroundColor: '#F5F5F5',
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  brandRow: { flexDirection: 'row', alignItems: 'center' },
  brandName: { fontSize: 22, fontWeight: 'bold', color: '#111', marginLeft: 10 },
  headerRight: { flexDirection: 'row', alignItems: 'center' },
  bellBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 10,
  },
  badge: {
    position: 'absolute', top: 4, right: 4,
    backgroundColor: '#111',
    minWidth: 16, height: 16, borderRadius: 8,
    justifyContent: 'center', alignItems: 'center',
    paddingHorizontal: 3,
  },
  badgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  avatar: { width: 40, height: 40, borderRadius: 20 },
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
  section: { paddingHorizontal: 20, marginTop: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#111' },
  subText: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  viewAll: { fontSize: 14, color: '#9CA3AF' },
  brandsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  brandItem: { alignItems: 'center', flex: 1 },
  brandCircle: {
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#111',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 8,
  },
  brandLogo: { width: 38, height: 38, tintColor: '#fff' },
  brandLabel: { fontSize: 12, color: '#6B7280' },
  bestCarsCard: {
    backgroundColor: '#fff',
    marginTop: 24,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  carCard: {
    width: 220,
    backgroundColor: '#F8F8F8',
    borderRadius: 16,
    marginRight: 12,
    overflow: 'hidden',
  },
  carImageWrapper: {
    height: 130,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center', alignItems: 'center',
    padding: 12,
  },
  carImage: { width: '100%', height: '100%' },
  heartBtn: {
    position: 'absolute', top: 10, right: 10,
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
  },
  carInfo: { padding: 12 },
  carName: { fontSize: 15, fontWeight: '700', color: '#111', marginBottom: 4 },
  ratingRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  ratingText: { fontSize: 13, color: '#111', marginRight: 4, fontWeight: '600' },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationText: { fontSize: 12, color: '#9CA3AF', marginLeft: 4 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between' },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 11, color: '#6B7280', marginLeft: 4 },
  nearbyCard: {
    height: 180,
    backgroundColor: '#E8E8E8',
    borderRadius: 20,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  nearbyImage: { width: '90%', height: '90%' },
});

export default HomeScreen;