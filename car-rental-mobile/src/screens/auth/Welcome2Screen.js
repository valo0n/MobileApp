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

const Welcome2Screen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      <ImageBackground
        source={{
          uri: "https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800&q=80",
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
          <Text style={styles.title}>
            Lets Start{"\n"}A New Experience{"\n"}With Car rental.
          </Text>

          <View style={styles.bottomSection}>
            {/* Description */}
            <Text style={styles.description}>
              Discover your next adventure with Qent. we're here to provide you
              with a seamless car rental experience. Let's get started on your
              journey.
            </Text>

            {/* Dots */}
            <View style={styles.dotsContainer}>
              <View style={styles.dot} />
              <View style={[styles.dot, styles.dotActive]} />
            </View>

            {/* Button */}
            <TouchableOpacity
              style={styles.button}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("Login")}
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
    backgroundColor: "rgba(0, 0, 0, 0.55)",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 30,
  },
  logoContainer: { marginTop: 20 },
  title: {
    fontSize: 38,
    fontWeight: "bold",
    color: "#fff",
    lineHeight: 46,
    letterSpacing: -0.5,
    marginTop: 40,
  },
  bottomSection: {
    flex: 1,
    justifyContent: "flex-end",
  },
  description: {
    fontSize: 14,
    color: "#fff",
    lineHeight: 22,
    marginBottom: 24,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.4)",
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24,
    backgroundColor: "#fff",
  },
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

export default Welcome2Screen;
