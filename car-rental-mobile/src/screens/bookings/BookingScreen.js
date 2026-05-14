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
  Switch,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";
import {
  BackIcon,
  MoreIcon,
  LocationIcon,
} from "../../components/common/Icons";

// ── Form icons ──
const UserSm = ({ color = "#9CA3AF" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <Circle cx="12" cy="7" r="4" stroke={color} strokeWidth="2" />
  </Svg>
);
const MailSm = ({ color = "#9CA3AF" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M22 6L12 13L2 6" stroke={color} strokeWidth="2" />
  </Svg>
);
const PhoneSm = ({ color = "#9CA3AF" }) => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M22 16.92V19.92C22 20.4 21.6 21 21 21C10 21 3 14 3 3C3 2.4 3.6 2 4.08 2H7.08C7.66 2 8.18 2.35 8.32 2.9C8.6 4.4 9.05 5.86 9.65 7.26C9.85 7.7 9.74 8.22 9.4 8.56L7.83 10.13C9.45 13.42 12.58 16.55 15.87 18.17L17.44 16.6C17.78 16.26 18.3 16.15 18.74 16.35C20.14 16.95 21.6 17.4 23.1 17.68C23.65 17.82 24 18.34 24 18.92"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      transform="translate(-1 0)"
    />
  </Svg>
);
const MaleIcon = ({ color = "#fff" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="6" r="3" stroke={color} strokeWidth="2" />
    <Path
      d="M12 9V20M9 15H15M9 20H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const FemaleIcon = ({ color = "#9CA3AF" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="8" r="4" stroke={color} strokeWidth="2" />
    <Path
      d="M12 12V20M9 17H15"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const OthersIcon = ({ color = "#9CA3AF" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="5" stroke={color} strokeWidth="2" />
    <Path
      d="M16 8L20 4M20 4V8M20 4H16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);
const CalendarSm = ({ color = "#9CA3AF" }) => (
  <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
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

const RENTAL_TIMES = ["Hour", "Day", "Weekly", "Monthly"];
const GENDERS = [
  { value: "male", label: "Male", Icon: MaleIcon },
  { value: "female", label: "Female", Icon: FemaleIcon },
  { value: "other", label: "Others", Icon: OthersIcon },
];

const BookingScreen = ({ navigation, route }) => {
  const car = route.params?.car || { name: "Tesla Model S" };

  const [withDriver, setWithDriver] = useState(false);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [gender, setGender] = useState("male");
  const [rentalTime, setRentalTime] = useState("Day");
  const [location, setLocation] = useState("Shore Dr, Chicago 0062 Usa");

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
        <Text style={styles.headerTitle}>Booking Details</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Step indicator */}
        <View style={styles.steps}>
          {["Booking details", "Payment methods", "confirmation"].map(
            (step, i) => (
              <View key={i} style={styles.stepItem}>
                <View
                  style={[
                    styles.stepCircle,
                    i === 0 && styles.stepCircleActive,
                  ]}
                >
                  {i === 0 && <View style={styles.stepDot} />}
                </View>
                <Text
                  style={[styles.stepLabel, i === 0 && styles.stepLabelActive]}
                >
                  {step}
                </Text>
              </View>
            ),
          )}
          <View style={styles.stepLine} />
        </View>

        {/* With driver toggle */}
        <View style={styles.driverCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.driverTitle}>Book with driver</Text>
            <Text style={styles.driverSub}>
              Don't have a driver? book with driver.
            </Text>
          </View>
          <Switch
            value={withDriver}
            onValueChange={setWithDriver}
            trackColor={{ false: "#E5E7EB", true: "#111" }}
            thumbColor="#fff"
          />
        </View>

        {/* Form fields */}
        <View style={styles.section}>
          <View style={styles.inputBox}>
            <UserSm color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Full Name*"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputBox}>
            <MailSm color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Email Address*"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          <View style={styles.inputBox}>
            <PhoneSm color="#9CA3AF" />
            <TextInput
              style={styles.input}
              placeholder="Contact*"
              placeholderTextColor="#9CA3AF"
              value={contact}
              onChangeText={setContact}
              keyboardType="phone-pad"
            />
          </View>
        </View>

        {/* Gender */}
        <View style={styles.section}>
          <Text style={styles.label}>Gender</Text>
          <View style={styles.genderRow}>
            {GENDERS.map((g) => {
              const active = gender === g.value;
              return (
                <TouchableOpacity
                  key={g.value}
                  style={[styles.genderChip, active && styles.genderChipActive]}
                  onPress={() => setGender(g.value)}
                >
                  <g.Icon color={active ? "#fff" : "#9CA3AF"} />
                  <Text
                    style={[
                      styles.genderText,
                      active && styles.genderTextActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Rental Date & Time */}
        <View style={styles.section}>
          <Text style={styles.label}>Rental Date &Time</Text>
          <View style={styles.timeRow}>
            {RENTAL_TIMES.map((t) => {
              const active = rentalTime === t;
              return (
                <TouchableOpacity
                  key={t}
                  style={[styles.timeChip, active && styles.timeChipActive]}
                  onPress={() => setRentalTime(t)}
                >
                  <Text
                    style={[styles.timeText, active && styles.timeTextActive]}
                  >
                    {t}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>

          <View style={styles.dateCard}>
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Pick up Date</Text>
              <View style={styles.dateValue}>
                <CalendarSm color="#9CA3AF" />
                <Text style={styles.dateText}>19/ January /2024</Text>
              </View>
            </View>
            <View style={styles.dateDivider} />
            <View style={styles.dateCol}>
              <Text style={styles.dateLabel}>Return Date</Text>
              <View style={styles.dateValue}>
                <CalendarSm color="#9CA3AF" />
                <Text style={styles.dateText}>22/ January /2024</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Car location */}
        <View style={styles.section}>
          <Text style={styles.label}>Car Location</Text>
          <View style={styles.inputBox}>
            <LocationIcon size={16} color="#9CA3AF" />
            <TextInput
              style={styles.input}
              value={location}
              onChangeText={setLocation}
              placeholderTextColor="#9CA3AF"
            />
          </View>
        </View>
      </ScrollView>

      {/* Pay Now */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("Payment", { car })}
        >
          <Text style={styles.payAmount}>$1400</Text>
          <Text style={styles.payNowText}>Pay Now</Text>
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

  steps: {
    flexDirection: "row",
    paddingHorizontal: 30,
    paddingTop: 22,
    paddingBottom: 24,
    position: "relative",
  },
  stepItem: { flex: 1, alignItems: "center", zIndex: 2 },
  stepCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#111",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepCircleActive: { backgroundColor: "#fff", borderColor: "#111" },
  stepDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#111" },
  stepLabel: { fontSize: 11, color: "#9CA3AF" },
  stepLabelActive: { color: "#111", fontWeight: "700" },
  stepLine: {
    position: "absolute",
    left: "20%",
    right: "20%",
    top: 33,
    height: 2,
    backgroundColor: "#111",
    zIndex: 1,
  },

  driverCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 20,
    padding: 14,
    borderRadius: 14,
    marginBottom: 16,
  },
  driverTitle: { fontSize: 14, fontWeight: "700", color: "#111" },
  driverSub: { fontSize: 11, color: "#9CA3AF", marginTop: 2 },

  section: { paddingHorizontal: 20, marginBottom: 4 },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 4,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: "#111",
    paddingVertical: 14,
    marginLeft: 10,
  },

  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
    marginTop: 8,
  },

  genderRow: { flexDirection: "row" },
  genderChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  genderChipActive: { backgroundColor: "#111", borderColor: "#111" },
  genderText: {
    fontSize: 13,
    color: "#9CA3AF",
    marginLeft: 6,
    fontWeight: "500",
  },
  genderTextActive: { color: "#fff", fontWeight: "700" },

  timeRow: { flexDirection: "row", marginBottom: 12 },
  timeChip: {
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    marginRight: 8,
  },
  timeChipActive: { backgroundColor: "#111", borderColor: "#111" },
  timeText: { fontSize: 13, color: "#9CA3AF" },
  timeTextActive: { color: "#fff", fontWeight: "600" },

  dateCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    alignItems: "center",
  },
  dateCol: { flex: 1 },
  dateDivider: {
    width: 1,
    height: 36,
    backgroundColor: "#E5E7EB",
    marginHorizontal: 8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: "#111",
    marginBottom: 6,
  },
  dateValue: { flexDirection: "row", alignItems: "center" },
  dateText: { fontSize: 12, color: "#6B7280", marginLeft: 6 },

  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "#F5F5F5",
  },
  payBtn: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  payAmount: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginRight: 12,
  },
  payNowText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default BookingScreen;
