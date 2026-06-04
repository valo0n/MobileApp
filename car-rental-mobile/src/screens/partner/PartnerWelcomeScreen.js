import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ImageBackground,
  SafeAreaView,
} from "react-native";

// QENT Partner program — Welcome (Get Started)
const PartnerWelcomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80",
        }}
        style={styles.bg}
        resizeMode="cover"
      >
        <View style={styles.overlay} />
        <SafeAreaView style={styles.safe}>
          {/* Logo bubble */}
          <View style={styles.logoCircle}>
            <Text style={styles.logoCar}>🚗</Text>
          </View>

          <Text style={styles.welcome}>Welcome to</Text>
          <Text style={styles.program}>QENT Partner program</Text>

          <View style={{ flex: 1 }} />

          <Text style={styles.desc}>
            Welcome to Our Community! We're glad to have you as a partner in our
            car rental service. Ready to rent out your car? Let's get started!
          </Text>

          <TouchableOpacity
            style={styles.btn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate("PartnerRegister")}
          >
            <Text style={styles.btnText}>Get Started</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  bg: { flex: 1 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  safe: { flex: 1, paddingHorizontal: 28, paddingVertical: 24 },
  logoCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 30,
  },
  logoCar: { fontSize: 30 },
  welcome: { fontSize: 40, fontWeight: "800", color: "#fff" },
  program: { fontSize: 24, fontWeight: "700", color: "#fff", marginTop: 6 },
  desc: {
    fontSize: 15,
    color: "#EDEDED",
    lineHeight: 22,
    marginBottom: 24,
  },
  btn: {
    backgroundColor: "#2D2D2D",
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: "center",
    marginBottom: 10,
  },
  btnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});

export default PartnerWelcomeScreen;
