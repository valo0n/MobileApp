import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { BackIcon } from "../../components/common/Icons";
import { AuthService } from "../../services";

const ForgotPasswordScreen = ({ navigation }) => {
  const [step, setStep] = useState(1); // 1 = email, 2 = kod + fjalekalim
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const sendCode = async () => {
    if (!email.trim()) return Alert.alert("Gabim", "Shkruaj email-in");
    setLoading(true);
    try {
      await AuthService.forgotPassword(email.trim());
      Alert.alert("U dërgua", "Kontrollo email-in për kodin 6-shifror.");
      setStep(2);
    } catch (e) {
      Alert.alert("Gabim", e.message || "Provo përsëri");
    } finally {
      setLoading(false);
    }
  };

  const reset = async () => {
    if (!code.trim() || !password.trim())
      return Alert.alert("Gabim", "Plotëso kodin dhe fjalëkalimin e ri");
    setLoading(true);
    try {
      await AuthService.resetPassword(email.trim(), code.trim(), password);
      Alert.alert("Sukses", "Fjalëkalimi u ndryshua. Kyçu me të riun.", [
        { text: "OK", onPress: () => navigation.navigate("Login") },
      ]);
    } catch (e) {
      Alert.alert("Gabim", e.message || "Provo përsëri");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={20} color="#111" />
        </TouchableOpacity>

        <View style={styles.body}>
          <Text style={styles.title}>Harruat fjalëkalimin?</Text>
          <Text style={styles.subtitle}>
            {step === 1
              ? "Shkruaj email-in dhe do të dërgojmë një kod verifikimi."
              : "Shkruaj kodin që morët në email dhe fjalëkalimin e ri."}
          </Text>

          {step === 1 ? (
            <>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="email@shembull.com"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
              />
              <TouchableOpacity
                style={styles.btn}
                onPress={sendCode}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Dërgo kodin</Text>
                )}
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.label}>Kodi (6 shifra)</Text>
              <TextInput
                style={styles.input}
                placeholder="123456"
                placeholderTextColor="#9CA3AF"
                keyboardType="number-pad"
                value={code}
                onChangeText={setCode}
                maxLength={6}
              />
              <Text style={styles.label}>Fjalëkalimi i ri</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity
                style={styles.btn}
                onPress={reset}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.btnText}>Ndrysho fjalëkalimin</Text>
                )}
              </TouchableOpacity>
              <TouchableOpacity onPress={sendCode} disabled={loading}>
                <Text style={styles.resend}>Ridërgo kodin</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F3F4F6" },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    margin: 16,
  },
  body: { paddingHorizontal: 24, paddingTop: 8 },
  title: { fontSize: 26, fontWeight: "800", color: "#111", marginBottom: 8 },
  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 28,
    lineHeight: 20,
  },
  label: { fontSize: 13, color: "#374151", marginBottom: 6, fontWeight: "600" },
  input: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 15,
    color: "#111",
    marginBottom: 18,
  },
  btn: {
    backgroundColor: "#111",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 6,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
  resend: {
    textAlign: "center",
    color: "#111",
    marginTop: 18,
    fontWeight: "600",
  },
});

export default ForgotPasswordScreen;
