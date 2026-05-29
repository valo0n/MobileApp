import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import Svg, { Path, Circle } from "react-native-svg";

// Sukses checkmark i madh
const SuccessIcon = () => (
  <Svg width="80" height="80" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="11" fill="#10B981" />
    <Path
      d="M7 12.5L10.5 16L17 9"
      stroke="#fff"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const PaymentSuccessScreen = ({ navigation, route }) => {
  const { car, amount, bookingRef } = route.params || {};

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      <View style={styles.content}>
        {/* Success icon */}
        <View style={styles.iconWrap}>
          <SuccessIcon />
        </View>

        {/* Title */}
        <Text style={styles.title}>Pagesa u Krye!</Text>
        <Text style={styles.subtitle}>
          Booking-u juaj u konfirmua me sukses. Kontrolloni email-in per
          detajet.
        </Text>

        {/* Receipt card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Numri i Booking-ut</Text>
            <Text style={styles.receiptVal}>{bookingRef || "BK-XXXXXXXX"}</Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Makina</Text>
            <Text style={styles.receiptVal}>
              {car?.name || car?.model || "Tesla Model S"}
            </Text>
          </View>
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Shuma e Paguar</Text>
            <Text style={[styles.receiptVal, { color: "#10B981" }]}>
              ${amount || 1400}
            </Text>
          </View>
          <View style={styles.receiptDivider} />
          <View style={styles.receiptRow}>
            <Text style={styles.receiptKey}>Statusi</Text>
            <View style={styles.statusBadge}>
              <Text style={styles.statusText}>Konfirmuar</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Buttons */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.primaryBtn}
          activeOpacity={0.85}
          onPress={() => navigation.navigate("MyBookings")}
        >
          <Text style={styles.primaryBtnText}>Shiko Booking-et e Mia</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.secondaryBtn}
          activeOpacity={0.85}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{ name: "MainTabs" }],
            })
          }
        >
          <Text style={styles.secondaryBtnText}>Kthehu ne Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 30,
  },
  iconWrap: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: "800", color: "#111", marginBottom: 10 },
  subtitle: {
    fontSize: 14,
    color: "#9CA3AF",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  receiptCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    width: "100%",
  },
  receiptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  receiptKey: { fontSize: 13, color: "#9CA3AF" },
  receiptVal: { fontSize: 14, color: "#111", fontWeight: "700" },
  receiptDivider: { height: 1, backgroundColor: "#E5E7EB", marginBottom: 14 },
  statusBadge: {
    backgroundColor: "#10B98122",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusText: { fontSize: 12, color: "#10B981", fontWeight: "700" },
  footer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  primaryBtn: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 12,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  secondaryBtn: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
  },
  secondaryBtnText: { color: "#111", fontSize: 16, fontWeight: "600" },
});

export default PaymentSuccessScreen;
