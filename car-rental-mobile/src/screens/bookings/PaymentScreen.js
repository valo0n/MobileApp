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
  Alert,
  ActivityIndicator,
} from "react-native";
import Svg, { Path, Rect, Circle } from "react-native-svg";
import { BackIcon, MoreIcon } from "../../components/common/Icons";
import { BookingService, PaymentService } from "../../services";
import { CardField, useStripe } from "@stripe/stripe-react-native";

// ── Icons ──
const CardIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="5"
      width="20"
      height="14"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
  </Svg>
);
const CashIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Rect
      x="2"
      y="6"
      width="20"
      height="12"
      rx="2"
      stroke={color}
      strokeWidth="2"
    />
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="2" />
  </Svg>
);
const PaypalIcon = ({ color = "#111" }) => (
  <Svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 19L9 5H15C17 5 18.5 6.5 18 8.5C17.5 11 15.5 12 13 12H10L9 19H7Z"
      stroke={color}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </Svg>
);
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

const METHODS = [
  { id: "credit_card", label: "Credit / Debit Card", Icon: CardIcon },
  { id: "paypal", label: "PayPal", Icon: PaypalIcon },
  { id: "cash", label: "Cash on Pickup", Icon: CashIcon },
];

const PaymentScreen = ({ navigation, route }) => {
  const car = route.params?.car || {};
  const bookingData = route.params?.bookingData || {};
  const amount = route.params?.amount || 1400;

  const [method, setMethod] = useState("credit_card");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [holder, setHolder] = useState("");
  const [loading, setLoading] = useState(false);
  const [cardComplete, setCardComplete] = useState(false);
  const { confirmPayment } = useStripe();

  // Formato numrin: 4242 4242 4242 4242
  const formatCardNumber = (t) => {
    const digits = t.replace(/\D/g, "").slice(0, 16);
    return digits.replace(/(.{4})/g, "$1 ").trim();
  };
  // Formato daten: MM/YY
  const formatExpiry = (t) => {
    const d = t.replace(/\D/g, "").slice(0, 4);
    if (d.length <= 2) return d;
    return `${d.slice(0, 2)}/${d.slice(2)}`;
  };

  const handlePay = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        car_id: car.id || 1,
        pickup_datetime:
          bookingData.pickup_datetime ||
          new Date().toISOString().slice(0, 19).replace("T", " "),
        dropoff_datetime:
          bookingData.dropoff_datetime ||
          new Date(Date.now() + 86400000 * 3)
            .toISOString()
            .slice(0, 19)
            .replace("T", " "),
        duration_hours: bookingData.duration_hours || 72,
        base_price: amount,
        total_price: amount,
        pickup_address:
          bookingData.pickup_address || "Shore Dr, Chicago 0062 Usa",
      };

      // ── CASH → krijo booking (pending) ──
      if (method === "cash") {
        const booking = await BookingService.create({
          ...bookingPayload,
          status: "pending",
        });
        const bookingId = booking.data?.id;
        const bookingRef =
          booking.data?.booking_ref || "BK-" + Date.now().toString().slice(-8);
        await PaymentService.create({
          booking_id: bookingId,
          amount,
          status: "pending",
          transaction_id: "CASH-" + Date.now(),
        });
        navigation.replace("PaymentSuccess", { car, amount, bookingRef });
        return;
      }

      // ── KARTE → fillimisht pagesa, booking-u VETEM pas suksesit ──
      if (!cardComplete) {
        Alert.alert("Gabim", "Plotesoni te dhenat e kartes");
        setLoading(false);
        return;
      }

      // 1) Krijo PaymentIntent vetem me shumen (pa booking ende)
      const intentRes = await PaymentService.createIntent(amount);
      const { clientSecret } = intentRes.data || {};
      if (!clientSecret) throw new Error("Could not start payment");

      // 2) Konfirmo karten
      const { paymentIntent, error } = await confirmPayment(clientSecret, {
        paymentMethodType: "Card",
      });

      // 3) Nese refuzohet/deshton → NUK krijohet booking fare
      if (error) {
        Alert.alert("Pagesa u refuzua", error.message);
        return;
      }
      if (!paymentIntent || paymentIntent.status !== "Succeeded") {
        Alert.alert("Pagesa", "Pagesa nuk u krye. Provoni perseri.");
        return;
      }

      // 4) Pagesa kaloi → tani krijo booking-un (confirmed) + regjistro pagesen
      const booking = await BookingService.create({
        ...bookingPayload,
        status: "confirmed",
      });
      const bookingId = booking.data?.id;
      const bookingRef =
        booking.data?.booking_ref || "BK-" + Date.now().toString().slice(-8);
      await PaymentService.create({
        booking_id: bookingId,
        amount,
        status: "completed",
        transaction_id: paymentIntent.id,
      });

      navigation.replace("PaymentSuccess", { car, amount, bookingRef });
    } catch (err) {
      Alert.alert("Pagesa Deshtoi", err.message || "Provoni perseri");
    } finally {
      setLoading(false);
    }
  };

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
        <Text style={styles.headerTitle}>Payment</Text>
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
                  style={[styles.stepCircle, i <= 1 && styles.stepCircleActive]}
                >
                  {i <= 1 && <View style={styles.stepDot} />}
                </View>
                <Text
                  style={[styles.stepLabel, i === 1 && styles.stepLabelActive]}
                >
                  {step}
                </Text>
              </View>
            ),
          )}
          <View style={styles.stepLine} />
        </View>

        {/* Payment methods */}
        <View style={styles.section}>
          <Text style={styles.label}>Zgjedh Menyren e Pageses</Text>
          {METHODS.map((m) => {
            const active = method === m.id;
            return (
              <TouchableOpacity
                key={m.id}
                style={[styles.methodCard, active && styles.methodCardActive]}
                onPress={() => setMethod(m.id)}
              >
                <View style={styles.methodIcon}>
                  <m.Icon color={active ? "#111" : "#9CA3AF"} />
                </View>
                <Text
                  style={[
                    styles.methodLabel,
                    active && styles.methodLabelActive,
                  ]}
                >
                  {m.label}
                </Text>
                <View style={[styles.radio, active && styles.radioActive]}>
                  {active && <View style={styles.radioDot} />}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Forma e kartes BRENDA app-it (Stripe CardField) */}
        {method === "credit_card" && (
          <View style={styles.section}>
            <Text style={styles.label}>Detajet e Kartës</Text>
            <CardField
              postalCodeEnabled={false}
              placeholders={{ number: "4242 4242 4242 4242" }}
              cardStyle={{
                backgroundColor: "#FFFFFF",
                textColor: "#111111",
                placeholderColor: "#9CA3AF",
                borderRadius: 12,
                fontSize: 15,
              }}
              style={{ width: "100%", height: 52, marginTop: 4 }}
              onCardChange={(d) => setCardComplete(d.complete)}
            />
            <Text style={{ color: "#9CA3AF", fontSize: 12, marginTop: 8 }}>
              Kartë testimi: 4242 4242 4242 4242 — datë në të ardhmen (12/34),
              çdo CVC.
            </Text>
          </View>
        )}

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.label}>Permbledhje</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Makina</Text>
              <Text style={styles.summaryVal}>
                {car.name || car.model || "Tesla Model S"}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Cmimi baze</Text>
              <Text style={styles.summaryVal}>${amount}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryKey}>Tarifa sherbimi</Text>
              <Text style={styles.summaryVal}>$0</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Totali</Text>
              <Text style={styles.summaryTotalVal}>${amount}</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Pay button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.85}
          onPress={handlePay}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.payAmount}>${amount}</Text>
              <Text style={styles.payText}>Pay Now</Text>
              <View style={{ marginLeft: 8 }}>
                <ArrowRight color="#fff" />
              </View>
            </>
          )}
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
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 6,
  },
  stepCircleActive: { borderColor: "#111" },
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

  section: { paddingHorizontal: 20, marginBottom: 8 },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginBottom: 12,
    marginTop: 8,
  },
  row: { flexDirection: "row" },

  methodCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#fff",
  },
  methodCardActive: { borderColor: "#111" },
  methodIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  methodLabel: { flex: 1, fontSize: 14, color: "#9CA3AF", fontWeight: "600" },
  methodLabelActive: { color: "#111" },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: "#D1D5DB",
    justifyContent: "center",
    alignItems: "center",
  },
  radioActive: { borderColor: "#111" },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: "#111" },

  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
  },
  input: { fontSize: 14, color: "#111", paddingVertical: 16 },

  summaryCard: { backgroundColor: "#fff", borderRadius: 14, padding: 16 },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  summaryKey: { fontSize: 13, color: "#9CA3AF" },
  summaryVal: { fontSize: 13, color: "#111", fontWeight: "600" },
  summaryDivider: { height: 1, backgroundColor: "#E5E7EB", marginVertical: 6 },
  summaryTotal: { fontSize: 15, color: "#111", fontWeight: "700" },
  summaryTotalVal: { fontSize: 15, color: "#111", fontWeight: "700" },

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
  payText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default PaymentScreen;
