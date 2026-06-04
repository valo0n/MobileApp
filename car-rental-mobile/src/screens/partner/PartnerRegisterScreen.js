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
  Image,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { BackIcon, MoreIcon } from "../../components/common/Icons";
import { CarService, OwnerService } from "../../services";

const COLORS = [
  { label: "White", value: "White", hex: "#FFFFFF", border: true },
  { label: "Gray", value: "Gray", hex: "#9CA3AF" },
  { label: "Blue", value: "Blue", hex: "#2563EB" },
  { label: "Black", value: "Black", hex: "#111111" },
];
const FUELS = ["Electric", "Petrol", "Diesel", "Hybrid"];
const CATEGORIES = ["Regular Cars", "Luxury Cars"];

const PartnerRegisterScreen = ({ navigation }) => {
  // Car owner info
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [contact, setContact] = useState("");
  const [license, setLicense] = useState("");

  // Car info
  const [tab, setTab] = useState("brand"); // 'brand' | 'model'
  const [brands, setBrands] = useState([]);
  const [brandId, setBrandId] = useState(null);
  const [model, setModel] = useState("");
  const [category, setCategory] = useState("Regular Cars");
  const [year, setYear] = useState("");
  const [pricePerDay, setPricePerDay] = useState("");
  const [plate, setPlate] = useState("");
  const [color, setColor] = useState("Blue");
  const [fuel, setFuel] = useState("Diesel");
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [terms, setTerms] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    CarService.getBrands()
      .then((res) => setBrands(res.data || []))
      .catch(() => setBrands([]));
  }, []);

  const pickImages = async () => {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert("Permission", "We need photo access to upload car images.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.7,
    });
    if (!result.canceled) {
      setImages(result.assets.map((a) => a.uri));
    }
  };

  const handleSubmit = async () => {
    if (!fullName || !email) {
      Alert.alert("Missing info", "Please fill Full Name and Email.");
      return;
    }
    if (!brandId) {
      Alert.alert("Missing info", "Please select a car brand.");
      return;
    }
    if (!model) {
      Alert.alert(
        "Missing info",
        "Please enter the car model (Car Model tab).",
      );
      return;
    }
    if (!plate) {
      Alert.alert("Missing info", "Please enter the car registration number.");
      return;
    }
    if (!pricePerDay) {
      Alert.alert("Missing info", "Please enter the price per day.");
      return;
    }
    if (!terms) {
      Alert.alert("Terms", "Please accept the terms to continue.");
      return;
    }

    try {
      setSubmitting(true);
      await OwnerService.register({
        full_name: fullName,
        contact_email: email,
        contact_phone: contact,
        driving_license: license,
        brand_id: brandId,
        category,
        model,
        year,
        color,
        fuel_type: fuel,
        license_plate: plate,
        price_per_day: pricePerDay,
        description: message,
        images,
      });
      Alert.alert(
        "Success",
        "You are now a QENT partner! Your car has been listed.",
        [{ text: "OK", onPress: () => navigation.navigate("MainTabs") }],
      );
    } catch (e) {
      Alert.alert("Submit failed", e.message || "Could not register");
    } finally {
      setSubmitting(false);
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
        <Text style={styles.headerTitle}>QENT Partner program</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Car owner information */}
        <Text style={styles.section}>Car owner information</Text>

        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="#9CA3AF"
          value={fullName}
          onChangeText={setFullName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email Addresses"
          placeholderTextColor="#9CA3AF"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contact"
          placeholderTextColor="#9CA3AF"
          value={contact}
          onChangeText={setContact}
          keyboardType="phone-pad"
        />
        <TextInput
          style={styles.input}
          placeholder="Driving licenses Number"
          placeholderTextColor="#9CA3AF"
          value={license}
          onChangeText={setLicense}
        />

        {/* Car information */}
        <Text style={[styles.section, { marginTop: 18 }]}>Car information</Text>

        {/* Brand / Model tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, tab === "brand" && styles.tabActive]}
            onPress={() => setTab("brand")}
          >
            <Text
              style={[styles.tabText, tab === "brand" && styles.tabTextActive]}
            >
              Car Brand
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, tab === "model" && styles.tabActive]}
            onPress={() => setTab("model")}
          >
            <Text
              style={[styles.tabText, tab === "model" && styles.tabTextActive]}
            >
              Car Model
            </Text>
          </TouchableOpacity>
        </View>

        {tab === "brand" ? (
          <View style={styles.card}>
            {/* Category toggle (Regular / Luxury) */}
            <View style={styles.catRow}>
              {CATEGORIES.map((c) => (
                <TouchableOpacity
                  key={c}
                  style={[styles.catBtn, category === c && styles.catBtnActive]}
                  onPress={() => setCategory(c)}
                >
                  <Text
                    style={[
                      styles.catText,
                      category === c && styles.catTextActive,
                    ]}
                  >
                    {c}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Brand grid */}
            <View style={styles.brandGrid}>
              {brands.length === 0 ? (
                <Text style={styles.muted}>Loading brands…</Text>
              ) : (
                brands.map((b) => (
                  <TouchableOpacity
                    key={b.id}
                    style={[
                      styles.brandChip,
                      brandId === b.id && styles.brandChipActive,
                    ]}
                    onPress={() => setBrandId(b.id)}
                  >
                    <Text
                      style={[
                        styles.brandText,
                        brandId === b.id && styles.brandTextActive,
                      ]}
                    >
                      {b.name}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </View>
        ) : (
          <TextInput
            style={styles.input}
            placeholder="Car Model (e.g. Model 3, X5)"
            placeholderTextColor="#9CA3AF"
            value={model}
            onChangeText={setModel}
          />
        )}

        {/* Year + Price per day */}
        <View style={styles.rowTwo}>
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Year"
            placeholderTextColor="#9CA3AF"
            value={year}
            onChangeText={setYear}
            keyboardType="number-pad"
          />
          <TextInput
            style={[styles.input, styles.half]}
            placeholder="Price / day ($)"
            placeholderTextColor="#9CA3AF"
            value={pricePerDay}
            onChangeText={setPricePerDay}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Upload images */}
        <TouchableOpacity style={styles.uploadBox} onPress={pickImages}>
          <Text style={styles.uploadText}>
            {images.length
              ? `${images.length} image(s) selected`
              : "Upload Cars images"}
          </Text>
          <Text style={styles.uploadPlus}>＋</Text>
        </TouchableOpacity>
        {images.length > 0 && (
          <ScrollView horizontal style={{ marginBottom: 14 }}>
            {images.map((uri, i) => (
              <Image key={i} source={{ uri }} style={styles.thumb} />
            ))}
          </ScrollView>
        )}

        {/* Registration number */}
        <TextInput
          style={styles.input}
          placeholder="Car Registration Number"
          placeholderTextColor="#9CA3AF"
          value={plate}
          onChangeText={setPlate}
          autoCapitalize="characters"
        />

        {/* Colors */}
        <Text style={styles.label}>Colors</Text>
        <View style={styles.colorRow}>
          {COLORS.map((c) => (
            <TouchableOpacity
              key={c.value}
              style={styles.colorItem}
              onPress={() => setColor(c.value)}
            >
              <View
                style={[
                  styles.colorDot,
                  { backgroundColor: c.hex },
                  c.border && { borderWidth: 1, borderColor: "#D1D5DB" },
                  color === c.value && styles.colorDotActive,
                ]}
              >
                {color === c.value && (
                  <Text
                    style={{
                      color: c.value === "White" ? "#111" : "#fff",
                      fontWeight: "700",
                    }}
                  >
                    ✓
                  </Text>
                )}
              </View>
              <Text style={styles.colorLabel}>{c.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Fuel type */}
        <Text style={styles.label}>Fuel Type</Text>
        <View style={styles.fuelRow}>
          {FUELS.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.fuelBtn, fuel === f && styles.fuelBtnActive]}
              onPress={() => setFuel(f)}
            >
              <Text
                style={[styles.fuelText, fuel === f && styles.fuelTextActive]}
              >
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Message */}
        <View style={styles.textareaBox}>
          <TextInput
            style={styles.textarea}
            placeholder="Enter your car ability, durability, etc message here......."
            placeholderTextColor="#9CA3AF"
            value={message}
            onChangeText={(t) => t.length <= 1000 && setMessage(t)}
            multiline
          />
          <Text style={styles.counter}>{message.length}/1000</Text>
        </View>

        {/* Terms */}
        <TouchableOpacity
          style={styles.termsRow}
          onPress={() => setTerms(!terms)}
        >
          <View style={[styles.checkbox, terms && styles.checkboxOn]}>
            {terms && <Text style={styles.checkMark}>✓</Text>}
          </View>
          <Text style={styles.termsText}>Trams & continue ⌄</Text>
        </TouchableOpacity>

        {/* Submit */}
        <TouchableOpacity
          style={styles.submit}
          onPress={handleSubmit}
          disabled={submitting}
          activeOpacity={0.85}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Submit</Text>
          )}
        </TouchableOpacity>
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
  headerTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  section: { fontSize: 16, fontWeight: "700", color: "#111", marginBottom: 12 },
  input: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 14,
    color: "#111",
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  rowTwo: { flexDirection: "row", justifyContent: "space-between" },
  half: { width: "48%" },
  tabRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: "#2D2D2D" },
  tabText: { fontSize: 14, color: "#6B7280", fontWeight: "600" },
  tabTextActive: { color: "#fff" },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  catRow: { flexDirection: "row", marginBottom: 12 },
  catBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "#E5E7EB",
  },
  catBtnActive: { borderBottomColor: "#2D2D2D" },
  catText: { fontSize: 13, color: "#9CA3AF", fontWeight: "600" },
  catTextActive: { color: "#111" },
  brandGrid: { flexDirection: "row", flexWrap: "wrap" },
  brandChip: {
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    margin: 4,
  },
  brandChipActive: { backgroundColor: "#2D2D2D" },
  brandText: { fontSize: 13, color: "#374151" },
  brandTextActive: { color: "#fff", fontWeight: "600" },
  muted: { color: "#9CA3AF", padding: 8 },
  uploadBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  uploadText: { color: "#6B7280", fontSize: 14 },
  uploadPlus: { fontSize: 22, color: "#111" },
  thumb: { width: 64, height: 64, borderRadius: 10, marginRight: 8 },
  label: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    marginTop: 6,
    marginBottom: 12,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  colorItem: { flexDirection: "row", alignItems: "center" },
  colorDot: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  colorDotActive: { borderWidth: 2, borderColor: "#2563EB" },
  colorLabel: { fontSize: 13, color: "#374151" },
  fuelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  fuelBtn: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    backgroundColor: "#fff",
  },
  fuelBtnActive: { backgroundColor: "#111", borderColor: "#111" },
  fuelText: { fontSize: 13, color: "#374151" },
  fuelTextActive: { color: "#fff", fontWeight: "600" },
  textareaBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ECECEC",
    marginBottom: 16,
  },
  textarea: {
    minHeight: 90,
    fontSize: 14,
    color: "#111",
    textAlignVertical: "top",
  },
  counter: { textAlign: "right", color: "#9CA3AF", fontSize: 12 },
  termsRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  checkboxOn: { backgroundColor: "#2D2D2D" },
  checkMark: { color: "#fff", fontSize: 13, fontWeight: "bold" },
  termsText: { fontSize: 14, color: "#111" },
  submit: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
  },
  submitText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default PartnerRegisterScreen;
