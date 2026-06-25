import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AuthService } from "../../services";

const VerifyEmailScreen = ({ navigation, route }) => {
  const email = route.params?.email || "";
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    // Dergo kodin automatikisht kur hapet ekrani
    if (email) sendCode(true);
  }, []);

  const goToApp = () => {
    navigation.reset({ index: 0, routes: [{ name: "MainTabs" }] });
  };

  const sendCode = async (silent = false) => {
    if (!email) return;
    setSending(true);
    try {
      await AuthService.sendVerification(email);
      if (!silent) Alert.alert("U dërgua", "Kontrollo email-in për kodin.");
    } catch (e) {
      const msg = e?.response?.data?.message || e?.message || "Provo përsëri";
      // Gabimet shfaqen gjithmonë (edhe ne dergim automatik), qe te mos fshihen
      Alert.alert("Gabim në dërgim", msg);
    } finally {
      setSending(false);
    }
  };

  const verify = async () => {
    if (!code.trim()) return Alert.alert("Gabim", "Shkruaj kodin");
    setLoading(true);
    try {
      await AuthService.verifyEmail(email, code.trim());
      Alert.alert("Sukses", "Email-i u verifikua!", [
        { text: "Vazhdo", onPress: goToApp },
      ]);
    } catch (e) {
      Alert.alert("Gabim", e.message || "Kod i pavlefshëm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.body}>
        <Text style={styles.title}>Verifiko email-in</Text>
        <Text style={styles.subtitle}>
          Dërguam një kod 6-shifror te{"\n"}
          <Text style={{ fontWeight: "700", color: "#111" }}>{email}</Text>
        </Text>

        <Text style={styles.label}>Kodi i verifikimit</Text>
        <TextInput
          style={styles.input}
          placeholder="123456"
          placeholderTextColor="#9CA3AF"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
          maxLength={6}
        />

        <TouchableOpacity
          style={styles.btn}
          onPress={verify}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.btnText}>Verifiko</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => sendCode(false)} disabled={sending}>
          <Text style={styles.resend}>
            {sending ? "Duke dërguar..." : "Ridërgo kodin"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToApp} style={{ marginTop: 24 }}>
          <Text style={styles.skip}>Më vonë</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  body: { paddingHorizontal: 24, paddingTop: 60 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
    lineHeight: 22,
  },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    color: "#111",
    marginBottom: 18,
    letterSpacing: 4,
  },
  btn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  resend: {
    textAlign: "center",
    color: "#111",
    marginTop: 18,
    fontWeight: "600",
  },
  skip: { textAlign: "center", color: "#9CA3AF", fontWeight: "600" },
});

export default VerifyEmailScreen;
