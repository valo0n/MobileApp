import React from "react";
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
} from "react-native";
import QentLogo from "../../components/common/QentLogo";

const WelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800&q=80",
        }}
        style={styles.background}
        resizeMode="cover"
      >
        <View style={styles.overlay} />

        <SafeAreaView style={styles.safeArea}>
          {/* Logo */}
          <View style={styles.logoContainer}>
            <QentLogo size={56} bg="white" fg="black" />
          </View>

          {/* Title */}
          <Text style={styles.title}>Welcome to{"\n"}Qent</Text>

          {/* Button */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Welcome2")}
            >
              <Text style={styles.buttonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  background: { flex: 1, width: "100%", height: "100%" },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.35)",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 40,
  },
  logoContainer: { marginTop: 20 },
  title: {
    fontSize: 56,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 64,
    letterSpacing: -1,
    marginTop: 40,
  },
  buttonContainer: { flex: 1, justifyContent: "flex-end" },
  button: {
    backgroundColor: "rgba(40, 40, 40, 0.95)",
    paddingVertical: 20,
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "600",
    letterSpacing: 0.3,
  },
});

export default WelcomeScreen;
