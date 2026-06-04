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
  Modal,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import { LocationIcon } from "../../components/common/Icons";
import { CarService } from "../../services";

// ── Mini icons ──
const CloseIcon = ({ size = 22, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 6L6 18M6 6L18 18"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const CalendarIcon = ({ size = 18, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M19 4H5C3.89543 4 3 4.89543 3 6V20C3 21.1046 3.89543 22 5 22H19C20.1046 22 21 21.1046 21 20V6C21 4.89543 20.1046 4 19 4Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <Path
      d="M16 2V6M8 2V6M3 10H21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const ClockIcon = ({ size = 18, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="10" stroke={color} strokeWidth="2" />
    <Path
      d="M12 6V12L16 14"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const ChevronDown = ({ size = 16, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M6 9L12 15L18 9"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const ChevronLeft = ({ size = 18, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const ChevronRight = ({ size = 18, color = "#111" }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 18L15 12L9 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

const RENTAL_TIMES = ["Hour", "Day", "Weekly", "Monthly"];
const COLORS = [
  { name: "White", value: "#fff", border: true },
  { name: "Gray", value: "#9CA3AF" },
  { name: "Blue", value: "#1E40FF" },
  { name: "Black", value: "#111" },
];
const SEATS = [2, 4, 6, 8];
const FUEL_TYPES = ["electric", "petrol", "diesel", "hybrid"];
const FUEL_LABELS = {
  electric: "Electric",
  petrol: "Petrol",
  diesel: "Diesel",
  hybrid: "Hybrid",
};
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const buildCalendar = (year, month) => {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrev = new Date(year, month, 0).getDate();
  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--)
    cells.push({ day: daysInPrev - i, current: false });
  for (let i = 1; i <= daysInMonth; i++) cells.push({ day: i, current: true });
  while (cells.length % 7 !== 0)
    cells.push({
      day: cells.length - daysInMonth - firstDay + 1,
      current: false,
    });
  return cells;
};

const FiltersScreen = ({ navigation }) => {
  // Kategorite nga backend
  const [categories, setCategories] = useState([]);
  const [carType, setCarType] = useState(null); // category_id ose null per 'All'

  const [rentalTime, setRentalTime] = useState("Day");
  const [seats, setSeats] = useState(null);
  const [fuel, setFuel] = useState(null);
  const [color, setColor] = useState(null);
  const [location, setLocation] = useState("");
  const [minPrice, setMinPrice] = useState(10);
  const [maxPrice, setMaxPrice] = useState(230);
  const [resultCount, setResultCount] = useState(null);

  // Date picker
  const [pickupDate, setPickupDate] = useState({
    day: 6,
    month: 0,
    year: 2022,
  });
  const [dateModalVisible, setDateModalVisible] = useState(false);
  const [tempMonth, setTempMonth] = useState(0);
  const [tempYear, setTempYear] = useState(2022);
  const [tempDay, setTempDay] = useState(6);

  const cells = buildCalendar(tempYear, tempMonth);

  useEffect(() => {
    // Ngarko kategorite reale nga DB
    CarService.getCategories()
      .then((res) => setCategories(res.data || []))
      .catch(() => setCategories([]));
    // Numero rezultatet fillestare
    updateCount({});
  }, []);

  // Ndertо filtrat dhe i dergon backend per me numeru rezultatet
  const buildFilters = () => {
    const f = {};
    if (carType) f.category_id = carType;
    if (minPrice) f.min_price = minPrice;
    if (maxPrice && maxPrice < 230) f.max_price = maxPrice;
    if (seats) f.min_seats = seats;
    if (fuel) f.fuel_type = fuel;
    return f;
  };

  const updateCount = async (filters) => {
    try {
      const res = await CarService.getAll(filters);
      setResultCount((res.data || []).length);
    } catch (e) {
      setResultCount(0);
    }
  };

  // Sa here ndryshon nje filter, perditeso numrin
  useEffect(() => {
    updateCount(buildFilters());
  }, [carType, seats, fuel, minPrice, maxPrice]);

  const openDatePicker = () => {
    setTempMonth(pickupDate.month);
    setTempYear(pickupDate.year);
    setTempDay(pickupDate.day);
    setDateModalVisible(true);
  };
  const confirmDate = () => {
    setPickupDate({ day: tempDay, month: tempMonth, year: tempYear });
    setDateModalVisible(false);
  };
  const prevMonth = () => {
    if (tempMonth === 0) {
      setTempMonth(11);
      setTempYear(tempYear - 1);
    } else setTempMonth(tempMonth - 1);
  };
  const nextMonth = () => {
    if (tempMonth === 11) {
      setTempMonth(0);
      setTempYear(tempYear + 1);
    } else setTempMonth(tempMonth + 1);
  };
  const formatDate = (d) =>
    `${String(d.day).padStart(2, "0")},${MONTHS[d.month].slice(0, 3)},${d.year}`;

  const clearAll = () => {
    setCarType(null);
    setSeats(null);
    setFuel(null);
    setColor(null);
    setMinPrice(10);
    setMaxPrice(230);
    setLocation("");
  };

  // Apliko filtrat — cojm te Search me filtrat e zgjedhur
  const applyFilters = () => {
    navigation.navigate("Search", { filters: buildFilters() });
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <CloseIcon size={22} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Filters</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Type of Cars — nga backend */}
        <View style={styles.section}>
          <Text style={styles.label}>Type of Cars</Text>
          <View style={styles.row}>
            <TouchableOpacity
              style={[styles.chip, carType === null && styles.chipActive]}
              onPress={() => setCarType(null)}
            >
              <Text
                style={[
                  styles.chipText,
                  carType === null && styles.chipTextActive,
                ]}
              >
                All Cars
              </Text>
            </TouchableOpacity>
            {categories
              .filter((c) => c.name !== "All Cars")
              .map((c) => {
                const active = carType === c.id;
                return (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.chip, active && styles.chipActive]}
                    onPress={() => setCarType(c.id)}
                  >
                    <Text
                      style={[styles.chipText, active && styles.chipTextActive]}
                    >
                      {c.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Price range */}
        <View style={styles.section}>
          <Text style={styles.label}>Price range</Text>
          <View style={styles.barsContainer}>
            {Array.from({ length: 30 }).map((_, i) => {
              const h =
                8 +
                Math.abs(Math.sin(i * 0.6)) * 32 +
                (i > 6 && i < 22 ? 10 : 0);
              return <View key={i} style={[styles.bar, { height: h }]} />;
            })}
            <View style={[styles.sliderDot, { left: 0 }]} />
            <View style={[styles.sliderDot, { right: 0 }]} />
          </View>
          <View style={styles.priceRow}>
            <View style={styles.priceCol}>
              <Text style={styles.priceLabel}>Minimum</Text>
              <View style={styles.priceBox}>
                <Text style={styles.priceText}>${minPrice}</Text>
              </View>
            </View>
            <View style={styles.priceCol}>
              <Text style={[styles.priceLabel, { textAlign: "right" }]}>
                Maximum
              </Text>
              <View style={styles.priceBox}>
                <Text style={styles.priceText}>${maxPrice}+</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.divider} />

        {/* Rental Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Rental Time</Text>
          <View style={styles.row}>
            {RENTAL_TIMES.map((t) => {
              const active = rentalTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.smallChip, active && styles.chipActive]}
                  onPress={() => setRentalTime(t)}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.dateRow}>
            <Text style={styles.dateLabel}>Pick up and Drop Date</Text>
            <TouchableOpacity style={styles.dateBtn} onPress={openDatePicker}>
              <CalendarIcon size={16} color="#111" />
              <Text style={styles.dateBtnText}>{formatDate(pickupDate)}</Text>
              <ChevronDown size={14} color="#111" />
            </TouchableOpacity>
          </View>

          <Text style={[styles.label, { marginTop: 18, marginBottom: 8 }]}>
            Car Location
          </Text>
          <View style={styles.locationBox}>
            <LocationIcon size={16} color="#9CA3AF" />
            <TextInput
              style={styles.locationInput}
              value={location}
              onChangeText={setLocation}
              placeholder="Shore Dr, Chicago 0062 Usa"
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>

        <View style={styles.divider} />

        {/* Colors */}
        <View style={styles.section}>
          <View style={styles.sectionHead}>
            <Text style={styles.label}>Colors</Text>
            <Text style={styles.seeAll}>See All</Text>
          </View>
          <View style={styles.row}>
            {COLORS.map((c) => {
              const active = color === c.name;
              return (
                <TouchableOpacity
                  key={c.name}
                  style={styles.colorItem}
                  onPress={() => setColor(active ? null : c.name)}
                >
                  <View
                    style={[
                      styles.colorCircle,
                      { backgroundColor: c.value },
                      c.border && { borderWidth: 1, borderColor: "#E5E7EB" },
                      active && styles.colorCircleActive,
                    ]}
                  />
                  <Text style={styles.colorLabel}>{c.name}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Seats */}
        <View style={styles.section}>
          <Text style={styles.label}>Siting Capacity</Text>
          <View style={styles.row}>
            {SEATS.map((s) => {
              const active = seats === s;
              return (
                <TouchableOpacity
                  key={s}
                  style={[styles.seatChip, active && styles.chipActive]}
                  onPress={() => setSeats(active ? null : s)}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {s}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fuel */}
        <View style={styles.section}>
          <Text style={styles.label}>Fuel Type</Text>
          <View style={styles.row}>
            {FUEL_TYPES.map((f) => {
              const active = fuel === f;
              return (
                <TouchableOpacity
                  key={f}
                  style={[styles.fuelChip, active && styles.chipActive]}
                  onPress={() => setFuel(active ? null : f)}
                >
                  <Text
                    style={[styles.chipText, active && styles.chipTextActive]}
                  >
                    {FUEL_LABELS[f]}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.footer}>
        <TouchableOpacity onPress={clearAll}>
          <Text style={styles.clearText}>Clear All</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.showBtn} onPress={applyFilters}>
          <Text style={styles.showBtnText}>
            Show {resultCount != null ? resultCount : ""} Cars
          </Text>
        </TouchableOpacity>
      </View>

      {/* Date Picker Modal */}
      <Modal
        visible={dateModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Time</Text>
            <View style={styles.timeRow}>
              <View style={[styles.timePill, styles.timePillActive]}>
                <ClockIcon size={14} color="#fff" />
                <Text style={styles.timePillTextActive}>10 : 30 am</Text>
              </View>
              <View style={styles.timePill}>
                <ClockIcon size={14} color="#111" />
                <Text style={styles.timePillText}>05 : 30 pm</Text>
              </View>
            </View>
            <View style={styles.calHeader}>
              <TouchableOpacity onPress={prevMonth}>
                <ChevronLeft size={20} color="#111" />
              </TouchableOpacity>
              <Text style={styles.calMonth}>
                {MONTHS[tempMonth]} {tempYear}
              </Text>
              <TouchableOpacity onPress={nextMonth}>
                <ChevronRight size={20} color="#111" />
              </TouchableOpacity>
            </View>
            <View style={styles.daysRow}>
              {DAYS_SHORT.map((d) => (
                <Text key={d} style={styles.dayHeader}>
                  {d}
                </Text>
              ))}
            </View>
            <View style={styles.divider2} />
            <View style={styles.cellsGrid}>
              {cells.map((c, i) => {
                const isSelected = c.current && tempDay === c.day;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[styles.cell, isSelected && styles.cellSelected]}
                    onPress={() => c.current && setTempDay(c.day)}
                    disabled={!c.current}
                  >
                    <Text
                      style={[
                        styles.cellText,
                        !c.current && styles.cellTextMuted,
                        isSelected && styles.cellTextSelected,
                      ]}
                    >
                      {String(c.day).padStart(2, "0")}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={styles.modalBtnRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setDateModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.doneBtn} onPress={confirmDate}>
                <Text style={styles.doneBtnText}>Done</Text>
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
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  section: { paddingHorizontal: 20, paddingVertical: 16 },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12 },
  seeAll: { fontSize: 13, color: "#9CA3AF" },
  row: { flexDirection: "row", flexWrap: "wrap" },
  divider: { height: 1, backgroundColor: "#E5E7EB", marginHorizontal: 20 },
  chip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  smallChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  seatChip: {
    width: 70,
    height: 40,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  fuelChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
    marginBottom: 8,
  },
  chipActive: { backgroundColor: "#111", borderColor: "#111" },
  chipText: { fontSize: 13, color: "#111" },
  chipTextActive: { color: "#fff", fontWeight: "600" },
  barsContainer: {
    height: 60,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    marginVertical: 14,
    position: "relative",
    paddingHorizontal: 18,
  },
  bar: { width: 4, backgroundColor: "#111", borderRadius: 2 },
  sliderDot: {
    position: "absolute",
    bottom: 14,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    elevation: 2,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 4,
  },
  priceCol: { width: "45%" },
  priceLabel: { fontSize: 12, color: "#6B7280", marginBottom: 6 },
  priceBox: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 12,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  priceText: { fontSize: 14, color: "#111", fontWeight: "600" },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
  },
  dateLabel: { fontSize: 14, color: "#111" },
  dateBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  dateBtnText: { fontSize: 13, color: "#111", marginHorizontal: 6 },
  locationBox: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 14,
    backgroundColor: "#fff",
  },
  locationInput: { flex: 1, fontSize: 13, color: "#111", marginLeft: 8 },
  colorItem: {
    alignItems: "center",
    flexDirection: "row",
    marginRight: 14,
    marginBottom: 8,
  },
  colorCircle: { width: 26, height: 26, borderRadius: 13, marginRight: 6 },
  colorCircleActive: { borderWidth: 2, borderColor: "#111" },
  colorLabel: { fontSize: 13, color: "#111" },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  clearText: { fontSize: 14, color: "#111", fontWeight: "500" },
  showBtn: {
    backgroundColor: "#2D2D2D",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 50,
  },
  showBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    width: "100%",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#111",
    marginBottom: 16,
  },
  timeRow: { flexDirection: "row", marginBottom: 18 },
  timePill: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 30,
    paddingVertical: 12,
    marginHorizontal: 4,
  },
  timePillActive: { backgroundColor: "#111", borderColor: "#111" },
  timePillText: {
    color: "#111",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "600",
  },
  timePillTextActive: {
    color: "#fff",
    fontSize: 13,
    marginLeft: 6,
    fontWeight: "600",
  },
  calHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  calMonth: { fontSize: 15, fontWeight: "700", color: "#111" },
  daysRow: { flexDirection: "row", marginBottom: 8 },
  dayHeader: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    color: "#6B7280",
    fontWeight: "500",
  },
  divider2: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 8 },
  cellsGrid: { flexDirection: "row", flexWrap: "wrap" },
  cell: {
    width: `${100 / 7}%`,
    height: 38,
    justifyContent: "center",
    alignItems: "center",
  },
  cellSelected: {
    backgroundColor: "#111",
    borderRadius: 19,
    width: 32,
    height: 32,
    alignSelf: "center",
    marginVertical: 3,
  },
  cellText: { fontSize: 14, color: "#111" },
  cellTextMuted: { color: "#D1D5DB" },
  cellTextSelected: { color: "#fff", fontWeight: "700" },
  modalBtnRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
  },
  cancelBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  cancelBtnText: { color: "#111", fontSize: 14, fontWeight: "600" },
  doneBtn: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "#111",
  },
  doneBtnText: { color: "#fff", fontSize: 14, fontWeight: "600" },
});

export default FiltersScreen;
