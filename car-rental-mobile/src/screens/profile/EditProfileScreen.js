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
  Image,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { BackIcon, MoreIcon } from "../../components/common/Icons";
import api from "../../services/api";

const EditPencil = ({ color = "#111" }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4V20H20V13M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const EditProfileScreen = ({ navigation, route }) => {
  const user = route.params?.user || {};

  const [firstName, setFirstName] = useState(user.first_name || "");
  const [lastName, setLastName] = useState(user.last_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [saving, setSaving] = useState(false);

  const avatar = user.avatar_url || "https://i.pravatar.cc/150?img=12";

  const handleSave = async () => {
    if (!firstName || !lastName) {
      Alert.alert("Gabim", "Emri dhe mbiemri jane te detyrueshem");
      return;
    }
    setSaving(true);
    try {
      // PUT /api/users/:id — perditeso profilin
      await api.put(`/users/${user.id}`, {
        first_name: firstName,
        last_name: lastName,
        phone: phone || null,
      });
      Alert.alert("Sukses", "Profili u perditesua!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ]);
    } catch (err) {
      Alert.alert("Gabim", err.message || "Nuk u ruajt dot profili");
    } finally {
      setSaving(false);
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
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 24 }}
        >
          {/* Avatar */}
          <View style={styles.avatarWrap}>
            <Image source={{ uri: avatar }} style={styles.avatar} />
            <TouchableOpacity style={styles.editBadge}>
              <EditPencil color="#111" />
            </TouchableOpacity>
          </View>
          <Text style={styles.name}>
            {firstName} {lastName}
          </Text>

          {/* Fields */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="First Name"
              placeholderTextColor="#9CA3AF"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Last Name"
              placeholderTextColor="#9CA3AF"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>

          <View style={[styles.inputBox, styles.inputDisabled]}>
            <TextInput
              style={[styles.input, { color: "#9CA3AF" }]}
              placeholder="Email Address"
              placeholderTextColor="#9CA3AF"
              value={email}
              editable={false}
            />
          </View>

          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Phone Number"
              placeholderTextColor="#9CA3AF"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
            />
          </View>

          {/* Save */}
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.85}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  avatarWrap: { alignSelf: "center", marginBottom: 12 },
  avatar: { width: 96, height: 96, borderRadius: 48 },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#F5F5F5",
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontSize: 17,
    fontWeight: "700",
    color: "#111",
    textAlign: "center",
    marginBottom: 28,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  inputDisabled: { backgroundColor: "#F0F0F0" },
  input: { fontSize: 15, color: "#111", paddingVertical: 16 },
  saveBtn: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginTop: 14,
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
});

export default EditProfileScreen;
