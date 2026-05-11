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
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import QentLogo from "../../components/common/QentLogo";
import { useAuthViewModel } from "../../viewmodels";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  const { login, loading } = useAuthViewModel();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }
    try {
      await login({ email, password });
      navigation.replace("MainTabs");
    } catch (err) {
      Alert.alert("Login Failed", err.message || "Invalid credentials");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Logo + brand */}
          <View style={styles.brandRow}>
            <QentLogo size={36} bg="black" fg="white" />
            <Text style={styles.brandName}>Qent</Text>
          </View>

          {/* Heading */}
          <Text style={styles.heading}>
            Welcome Back{"\n"}Ready to hit the road.
          </Text>

          {/* Email */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email/Phone Number"
              placeholderTextColor="#9CA3AF"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
            />
          </View>

          {/* Password */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.eye}
            >
              <Text style={styles.eyeIcon}>{showPassword ? "👁" : "👁‍🗨"}</Text>
            </TouchableOpacity>
          </View>

          {/* Remember + forgot */}
          <View style={styles.rememberRow}>
            <TouchableOpacity
              style={styles.checkRow}
              onPress={() => setRememberMe(!rememberMe)}
            >
              <View
                style={[styles.checkbox, rememberMe && styles.checkboxChecked]}
              >
                {rememberMe && <Text style={styles.checkMark}>✓</Text>}
              </View>
              <Text style={styles.rememberText}>Remember Me</Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text style={styles.forgotText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          {/* Login */}
          <TouchableOpacity
            style={styles.loginBtn}
            activeOpacity={0.85}
            onPress={handleLogin}
            disabled={loading}
          >
            <Text style={styles.loginBtnText}>
              {loading ? "Loading..." : "Login"}
            </Text>
          </TouchableOpacity>

          {/* Sign up */}
          <TouchableOpacity
            style={styles.signUpBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("Register")}
          >
            <Text style={styles.signUpBtnText}>Sing up</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.footerLink}>Sign Up.</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 30,
  },
  brandName: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#111",
    marginLeft: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#111",
    lineHeight: 36,
    marginBottom: 30,
  },
  inputBox: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 14,
    flexDirection: "row",
    alignItems: "center",
  },
  input: { flex: 1, fontSize: 15, color: "#111", paddingVertical: 16 },
  eye: { padding: 4 },
  eyeIcon: { fontSize: 18, color: "#9CA3AF" },
  rememberRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 22,
    marginTop: 4,
  },
  checkRow: { flexDirection: "row", alignItems: "center" },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: "#2D2D2D",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 8,
  },
  checkboxChecked: { backgroundColor: "#2D2D2D" },
  checkMark: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  rememberText: { fontSize: 14, color: "#111" },
  forgotText: { fontSize: 14, color: "#111" },
  loginBtn: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 12,
  },
  loginBtnText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  signUpBtn: {
    backgroundColor: "#E8E8E8",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 20,
  },
  signUpBtnText: { color: "#111", fontSize: 16, fontWeight: "600" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 30,
  },
  footerText: { color: "#6B7280", fontSize: 14 },
  footerLink: { color: "#111", fontSize: 14, fontWeight: "600" },
});

export default LoginScreen;
