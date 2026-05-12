import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
} from 'react-native';

const PaymentConfirmationScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#E9E6E6" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.page}>
        <View style={styles.phoneCard}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity style={styles.circleButton} onPress={() => navigation.goBack()}>
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Confirmation</Text>

            <TouchableOpacity style={styles.circleButton}>
              <Text style={styles.moreText}>•••</Text>
            </TouchableOpacity>
          </View>

          {/* Steps */}
          <View style={styles.stepsWrapper}>
            <View style={styles.stepLine} />

            <View style={styles.stepItem}>
              <View style={styles.stepDone}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.stepText}>Booking details</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepDone}>
                <Text style={styles.checkText}>✓</Text>
              </View>
              <Text style={styles.stepText}>Payment methods</Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepActive} />
              <Text style={[styles.stepText, styles.stepTextActive]}>confirmation</Text>
            </View>
          </View>

          {/* Car image */}
          <View style={styles.carImageWrapper}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1560958089-b8a1929cea89?w=900&q=80',
              }}
              style={styles.carImage}
              resizeMode="contain"
            />
          </View>

          {/* Car details */}
          <View style={styles.carInfoRow}>
            <View style={styles.carTextBox}>
              <Text style={styles.carName}>Tesla Model S</Text>
              <Text style={styles.carDescription}>
                A car with high specs that are rented at an affordable price.
              </Text>
            </View>

            <View style={styles.ratingBox}>
              <View style={styles.ratingRow}>
                <Text style={styles.ratingText}>5.0</Text>
                <Text style={styles.star}>★</Text>
              </View>
              <Text style={styles.reviewText}>(100+Reviews)</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Booking information */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Booking informational</Text>

            <InfoRow label="Booking ID" value="00451" />
            <InfoRow label="Name" value="Benjamin Jack" />
            <InfoRow label="Pick up Date" value="19 Jan 2024   10:30 am" />
            <InfoRow label="Return Date" value="22 Jan 2024   05:00 pm" />
            <InfoRow label="Location" value="Shore Dr, Chicago 0062 Usa" icon="⊕" />
          </View>

          <View style={styles.divider} />

          {/* Payment */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Payment</Text>

            <PaymentRow label="Trx ID" value="#141mtsIv5854d58" bold />
            <PaymentRow label="Amount" value="$1400" />
            <PaymentRow label="Service fee" value="$15" />
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total amount</Text>
            <Text style={styles.totalValue}>$1415</Text>
          </View>

          <View style={styles.payMethodRow}>
            <Text style={styles.payMethodText}>Payment with</Text>

            <View style={styles.masterCardSmall}>
              <View style={[styles.cardCircle, styles.redCircle]} />
              <View style={[styles.cardCircle, styles.orangeCircle]} />
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.confirmText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const InfoRow = ({ label, value, icon }) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>• {label}</Text>

    <View style={styles.infoValueWrapper}>
      {icon && <Text style={styles.locationIcon}>{icon}</Text>}
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const PaymentRow = ({ label, value, bold }) => (
  <View style={styles.paymentRow}>
    <Text style={styles.paymentLabel}>{label}</Text>
    <Text style={[styles.paymentValue, bold && styles.boldValue]}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9E6E6',
  },
  page: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  phoneCard: {
    backgroundColor: '#F9F9F9',
    borderRadius: 28,
    overflow: 'hidden',
    paddingBottom: 18,
  },

  header: {
    height: 72,
    paddingHorizontal: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  circleButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backText: {
    fontSize: 28,
    color: '#1C2526',
    marginTop: -3,
  },
  moreText: {
    fontSize: 15,
    color: '#1C2526',
    letterSpacing: -2,
  },
  headerTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#111',
  },

  stepsWrapper: {
    height: 54,
    paddingHorizontal: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    position: 'relative',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E4E4E4',
    paddingTop: 12,
  },
  stepLine: {
    position: 'absolute',
    left: 48,
    right: 48,
    top: 22,
    height: 1,
    backgroundColor: '#1E2A2B',
  },
  stepItem: {
    alignItems: 'center',
    width: 88,
  },
  stepDone: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#1E2A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepActive: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#1E2A2B',
    borderWidth: 3,
    borderColor: '#FFFFFF',
  },
  checkText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '700',
  },
  stepText: {
    fontSize: 8,
    color: '#777',
    marginTop: 6,
  },
  stepTextActive: {
    color: '#111',
    fontWeight: '700',
  },

  carImageWrapper: {
    marginTop: 22,
    height: 160,
    justifyContent: 'center',
    alignItems: 'center',
  },
  carImage: {
    width: '92%',
    height: '100%',
  },

  carInfoRow: {
    paddingHorizontal: 18,
    marginTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  carTextBox: {
    flex: 1,
    paddingRight: 10,
  },
  carName: {
    fontSize: 13,
    fontWeight: '800',
    color: '#111',
    marginBottom: 7,
  },
  carDescription: {
    fontSize: 10,
    color: '#8C8C8C',
    lineHeight: 15,
  },
  ratingBox: {
    alignItems: 'flex-end',
    marginTop: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
    marginRight: 3,
  },
  star: {
    fontSize: 12,
    color: '#FF9500',
  },
  reviewText: {
    fontSize: 8,
    color: '#777',
    marginTop: 2,
  },

  divider: {
    height: 1,
    backgroundColor: '#E3E3E3',
    marginHorizontal: 18,
    marginTop: 20,
  },

  section: {
    paddingHorizontal: 18,
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#111',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 13,
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 10,
    color: '#555',
  },
  infoValueWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    maxWidth: '68%',
  },
  locationIcon: {
    fontSize: 10,
    color: '#777',
    marginRight: 4,
  },
  infoValue: {
    fontSize: 10,
    color: '#8B8B8B',
    textAlign: 'right',
  },

  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 13,
  },
  paymentLabel: {
    fontSize: 10,
    color: '#555',
  },
  paymentValue: {
    fontSize: 10,
    color: '#111',
    fontWeight: '700',
  },
  boldValue: {
    fontWeight: '900',
  },

  totalRow: {
    marginHorizontal: 18,
    borderTopWidth: 1,
    borderTopColor: '#E3E3E3',
    paddingTop: 13,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  totalLabel: {
    fontSize: 11,
    color: '#111',
    fontWeight: '800',
  },
  totalValue: {
    fontSize: 11,
    color: '#111',
    fontWeight: '900',
  },

  payMethodRow: {
    marginHorizontal: 18,
    marginTop: 22,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  payMethodText: {
    fontSize: 10,
    color: '#777',
  },
  masterCardSmall: {
    width: 34,
    height: 22,
    borderRadius: 4,
    backgroundColor: '#1F2A2B',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardCircle: {
    width: 11,
    height: 11,
    borderRadius: 6,
  },
  redCircle: {
    backgroundColor: '#EB001B',
  },
  orangeCircle: {
    backgroundColor: '#F79E1B',
    marginLeft: -4,
  },

  confirmButton: {
    marginHorizontal: 18,
    marginTop: 26,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1F2A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confirmText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default PaymentConfirmationScreen;