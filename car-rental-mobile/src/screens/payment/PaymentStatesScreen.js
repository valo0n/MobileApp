import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from "react-native";

const PaymentStatesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9E6E6" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.page}
      >
        <View style={styles.phoneCard}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Payment States</Text>

            <TouchableOpacity style={styles.circleButton}>
              <Text style={styles.moreText}>•••</Text>
            </TouchableOpacity>
          </View>

          {/* Success icon */}
          <View style={styles.successSection}>
            <View style={styles.successIconWrapper}>
              <View style={styles.successCircle}>
                <Text style={styles.checkIcon}>✓</Text>
              </View>

              <View style={[styles.dot, styles.dot1]} />
              <View style={[styles.dot, styles.dot2]} />
              <View style={[styles.dot, styles.dot3]} />
              <View style={[styles.dot, styles.dot4]} />
              <View style={[styles.dot, styles.dot5]} />
              <View style={[styles.dot, styles.dot6]} />

              <Text style={[styles.confetti, styles.confetti1]}>⌇</Text>
              <Text style={[styles.confetti, styles.confetti2]}>⌒</Text>
              <Text style={[styles.confetti, styles.confetti3]}>⌁</Text>
            </View>

            <Text style={styles.successTitle}>Payment successful</Text>
            <Text style={styles.successSubtitle}>
              Your car rent Booking has been successfully
            </Text>
          </View>

          {/* Booking card */}
          <View style={styles.infoCard}>
            <Text style={styles.cardTitle}>Booking information</Text>
            <View style={styles.cardDivider} />

            <InfoRow label="Car Model" value="Tesla Model 3" />
            <InfoRow label="Rental Date" value="19Jan24 - 22Jan 24" />
            <InfoRow label="Name" value="Benjamin Jack" />
          </View>

          {/* Transaction detail */}
          <View style={styles.transactionSection}>
            <Text style={styles.cardTitle}>Transaction detail</Text>

            <DetailRow label="Transaction ID" value="#TD0012380J1" />
            <DetailRow label="Transaction Date" value="01Jan2024 - 10:30 am" />
            <DetailRow label="Payment Method" value="123 **** ****225" card />

            <View style={styles.dashedDivider} />

            <DetailRow label="Amount" value="$1400" dark />
            <DetailRow label="Service fee" value="$15" dark />
            <DetailRow label="Tax" value="$0" dark />

            <View style={styles.dashedDivider} />

            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total amount</Text>
              <Text style={styles.totalValue}>$1415</Text>
            </View>
          </View>

          {/* Buttons */}
          <TouchableOpacity style={styles.receiptButton}>
            <Text style={styles.downloadIcon}>⇩</Text>
            <Text style={styles.receiptText}>Download Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareIcon}>⌘</Text>
            <Text style={styles.shareText}>Share Your Receipt</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.homeButton}
            onPress={() => navigation.navigate("Home")}
          >
            <Text style={styles.homeText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    <Text style={styles.infoValue}>{value}</Text>
  </View>
);

const DetailRow = ({ label, value, card, dark }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}</Text>

    <View style={styles.detailValueWrapper}>
      {card && (
        <View style={styles.masterCardSmall}>
          <View style={[styles.cardCircle, styles.redCircle]} />
          <View style={[styles.cardCircle, styles.orangeCircle]} />
        </View>
      )}
      <Text style={[styles.detailValue, dark && styles.detailValueDark]}>
        {value}
      </Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#E9E6E6",
  },
  page: {
    paddingHorizontal: 14,
    paddingBottom: 24,
  },
  phoneCard: {
    backgroundColor: "#F9F9F9",
    borderRadius: 26,
    overflow: "hidden",
    paddingBottom: 20,
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#E4E4E4",
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  backText: {
    fontSize: 28,
    color: "#1C2526",
    marginTop: -3,
  },
  moreText: {
    fontSize: 15,
    color: "#1C2526",
    letterSpacing: -2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#111",
  },

  successSection: {
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 20,
  },
  successIconWrapper: {
    width: 110,
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  successCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#29C768",
    justifyContent: "center",
    alignItems: "center",
  },
  checkIcon: {
    color: "#FFFFFF",
    fontSize: 34,
    fontWeight: "900",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#29C768",
    position: "absolute",
  },
  dot1: {
    top: 5,
    left: 48,
  },
  dot2: {
    top: 28,
    left: 15,
  },
  dot3: {
    top: 32,
    right: 12,
  },
  dot4: {
    bottom: 18,
    left: 24,
  },
  dot5: {
    bottom: 10,
    right: 25,
  },
  dot6: {
    top: 0,
    right: 44,
  },
  confetti: {
    position: "absolute",
    color: "#29C768",
    fontSize: 20,
    fontWeight: "800",
  },
  confetti1: {
    top: 8,
    right: 18,
    transform: [{ rotate: "20deg" }],
  },
  confetti2: {
    bottom: 14,
    left: 8,
    transform: [{ rotate: "-25deg" }],
  },
  confetti3: {
    top: 4,
    left: 24,
    transform: [{ rotate: "-35deg" }],
  },
  successTitle: {
    fontSize: 13,
    fontWeight: "800",
    color: "#111",
    marginTop: 2,
  },
  successSubtitle: {
    fontSize: 10,
    color: "#9A9A9A",
    marginTop: 8,
  },

  infoCard: {
    marginHorizontal: 18,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E3E3E3",
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  cardTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: "#111",
    marginBottom: 12,
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#E7E7E7",
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 13,
  },
  infoLabel: {
    fontSize: 10,
    color: "#8A8A8A",
  },
  infoValue: {
    fontSize: 10,
    color: "#111",
    fontWeight: "600",
  },

  transactionSection: {
    marginHorizontal: 18,
    marginTop: 22,
    paddingTop: 4,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 10,
    color: "#8A8A8A",
  },
  detailValueWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailValue: {
    fontSize: 10,
    color: "#111",
    fontWeight: "600",
  },
  detailValueDark: {
    fontWeight: "800",
  },
  dashedDivider: {
    borderTopWidth: 1,
    borderColor: "#D9D9D9",
    borderStyle: "dashed",
    marginTop: 4,
    marginBottom: 15,
  },

  masterCardSmall: {
    width: 24,
    height: 15,
    borderRadius: 3,
    backgroundColor: "#1F2A2B",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 7,
  },
  cardCircle: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  redCircle: {
    backgroundColor: "#EB001B",
  },
  orangeCircle: {
    backgroundColor: "#F79E1B",
    marginLeft: -3,
  },

  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  totalLabel: {
    fontSize: 11,
    color: "#111",
    fontWeight: "900",
  },
  totalValue: {
    fontSize: 11,
    color: "#111",
    fontWeight: "900",
  },

  receiptButton: {
    marginHorizontal: 18,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#EFEFEF",
    borderWidth: 1,
    borderColor: "#DADADA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },
  downloadIcon: {
    fontSize: 16,
    color: "#9A9A9A",
    marginRight: 8,
  },
  receiptText: {
    fontSize: 11,
    color: "#9A9A9A",
    fontWeight: "600",
  },

  shareButton: {
    marginHorizontal: 18,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DADADA",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 12,
  },
  shareIcon: {
    fontSize: 16,
    color: "#9A9A9A",
    marginRight: 8,
  },
  shareText: {
    fontSize: 11,
    color: "#9A9A9A",
    fontWeight: "600",
  },

  homeButton: {
    marginHorizontal: 18,
    height: 58,
    borderRadius: 29,
    backgroundColor: "#1F2A2B",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  homeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "800",
  },
});

export default PaymentStatesScreen;
