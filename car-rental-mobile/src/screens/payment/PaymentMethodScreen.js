import React, { useState } from 'react';
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
} from 'react-native';

const PaymentMethodScreen = ({ navigation }) => {
  const [selectedMethod, setSelectedMethod] = useState('cash');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#F4F2F2" />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.circleButton}
              onPress={() => navigation.goBack()}
            >
              <Text style={styles.backText}>‹</Text>
            </TouchableOpacity>

            <Text style={styles.headerTitle}>Payment methods</Text>

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
              <View style={styles.stepActive} />
              <Text style={[styles.stepText, styles.stepTextActive]}>
                Payment methods
              </Text>
            </View>

            <View style={styles.stepItem}>
              <View style={styles.stepInactive} />
              <Text style={styles.stepText}>Confirmation</Text>
            </View>
          </View>

          {/* Card */}
          <View style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.mastercard}>
                <View style={[styles.cardCircle, styles.redCircle]} />
                <View style={[styles.cardCircle, styles.orangeCircle]} />
              </View>

              <Text style={styles.visaText}>VISA</Text>
            </View>

            <View style={styles.chip} />

            <View style={styles.cardDetails}>
              <View>
                <Text style={styles.cardName}>BANJAMIN JACK</Text>
                <Text style={styles.cardNumber}>9655     9655     9655     9655</Text>
              </View>

              <View>
                <Text style={styles.expireLabel}>Expire</Text>
                <Text style={styles.expireText}>10-5-2030</Text>
              </View>
            </View>
          </View>

          {/* Select payment method */}
          <Text style={styles.sectionLabel}>select payment method</Text>

          <TouchableOpacity
            style={styles.paymentOption}
            onPress={() => setSelectedMethod('cash')}
          >
            <View style={styles.optionLeft}>
              <View style={styles.smallBox}>
                {selectedMethod === 'cash' && <View style={styles.innerDot} />}
              </View>
              <Text style={styles.optionText}>Cash payment</Text>
            </View>

            <View style={styles.defaultBadge}>
              <Text style={styles.defaultText}>DAFULT</Text>
            </View>
          </TouchableOpacity>

          {/* Card information */}
          <Text style={styles.sectionLabel}>Card information</Text>

          <TextInput
            placeholder="Full Name"
            placeholderTextColor="#A8A8A8"
            style={styles.input}
          />

          <TextInput
            placeholder="Email Address"
            placeholderTextColor="#A8A8A8"
            keyboardType="email-address"
            style={styles.input}
          />

          <View style={styles.cardNumberInput}>
            <TextInput
              placeholder="Number"
              placeholderTextColor="#A8A8A8"
              keyboardType="number-pad"
              style={styles.flexInput}
            />

            <View style={styles.cardLogos}>
              <Text style={styles.logoSmall}>VISA</Text>
              <Text style={styles.logoSmallDark}>●●</Text>
              <Text style={styles.logoSmall}>CARD</Text>
            </View>
          </View>

          <View style={styles.row}>
            <TextInput
              placeholder="MM / YY"
              placeholderTextColor="#A8A8A8"
              style={[styles.input, styles.halfInput]}
            />

            <View style={[styles.input, styles.halfInput, styles.cvcWrapper]}>
              <TextInput
                placeholder="CVC"
                placeholderTextColor="#A8A8A8"
                keyboardType="number-pad"
                style={styles.cvcInput}
              />
              <Text style={styles.calendarIcon}>▣</Text>
            </View>
          </View>

          {/* Country */}
          <Text style={styles.sectionLabel}>Country or region</Text>

          <TouchableOpacity style={styles.countryInput}>
            <Text style={styles.countryText}>United States</Text>
            <Text style={styles.chevron}>⌄</Text>
          </TouchableOpacity>

          <TextInput
            placeholder="ZIP"
            placeholderTextColor="#A8A8A8"
            keyboardType="number-pad"
            style={styles.input}
          />

          <TouchableOpacity style={styles.termsRow}>
            <View style={styles.checkedBox}>
              <Text style={styles.checkedText}>✓</Text>
            </View>
            <Text style={styles.termsText}>Terms & continue</Text>
          </TouchableOpacity>

          <View style={styles.payWithRow}>
            <View style={styles.divider} />
            <Text style={styles.payWithText}>Pay with card Or</Text>
            <View style={styles.divider} />
          </View>

          <TouchableOpacity style={styles.walletButton}>
            <Text style={styles.appleLogo}></Text>
            <Text style={styles.walletText}>Apple pay</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.walletButton}>
            <Text style={styles.googleLogo}>G</Text>
            <Text style={styles.walletText}>Google Pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.continueButton}
            onPress={() => navigation.navigate('PaymentConfirmation')}
          >
            <Text style={styles.continueText}>Continue</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#E9E6E6',
  },
  container: {
    flex: 1,
    backgroundColor: '#E9E6E6',
  },
  scrollContent: {
    marginHorizontal: 24,
    backgroundColor: '#F9F9F9',
    borderRadius: 28,
    paddingBottom: 18,
    overflow: 'hidden',
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
  stepInactive: {
    width: 13,
    height: 13,
    borderRadius: 7,
    backgroundColor: '#1E2A2B',
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

  card: {
    marginHorizontal: 18,
    marginTop: 24,
    height: 168,
    borderRadius: 10,
    backgroundColor: '#1F2A2B',
    padding: 20,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  mastercard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardCircle: {
    width: 25,
    height: 25,
    borderRadius: 13,
  },
  redCircle: {
    backgroundColor: '#EB001B',
  },
  orangeCircle: {
    backgroundColor: '#F79E1B',
    marginLeft: -9,
  },
  visaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
    fontStyle: 'italic',
  },
  chip: {
    width: 22,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#E7B74A',
    marginTop: 18,
  },
  cardDetails: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  cardName: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 12,
  },
  cardNumber: {
    color: '#FFFFFF',
    fontSize: 13,
    letterSpacing: 1,
    fontWeight: '600',
  },
  expireLabel: {
    color: '#AAB1B1',
    fontSize: 8,
  },
  expireText: {
    color: '#FFFFFF',
    fontSize: 9,
    marginTop: 3,
  },

  sectionLabel: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 8,
    fontSize: 11,
    fontWeight: '700',
    color: '#111',
  },
  paymentOption: {
    marginHorizontal: 18,
    height: 43,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  smallBox: {
    width: 16,
    height: 16,
    borderWidth: 1,
    borderColor: '#A9A9A9',
    borderRadius: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#1F2A2B',
  },
  optionText: {
    marginLeft: 10,
    fontSize: 11,
    color: '#8B8B8B',
  },
  defaultBadge: {
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 5,
    backgroundColor: '#EFEFEF',
  },
  defaultText: {
    fontSize: 8,
    fontWeight: '700',
    color: '#B0B0B0',
  },

  input: {
    marginHorizontal: 18,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 14,
    fontSize: 12,
    color: '#111',
    marginBottom: 10,
  },
  cardNumberInput: {
    marginHorizontal: 18,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flexInput: {
    flex: 1,
    fontSize: 12,
    color: '#111',
  },
  cardLogos: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoSmall: {
    fontSize: 7,
    fontWeight: '800',
    color: '#555',
    marginLeft: 5,
  },
  logoSmallDark: {
    fontSize: 8,
    color: '#222',
    marginLeft: 5,
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: 18,
    gap: 0,
  },
  halfInput: {
    flex: 1,
    marginHorizontal: 0,
  },
  cvcWrapper: {
    marginLeft: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cvcInput: {
    flex: 1,
    fontSize: 12,
    color: '#111',
  },
  calendarIcon: {
    fontSize: 14,
    color: '#757575',
  },

  countryInput: {
    marginHorizontal: 18,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E1E1E1',
    paddingHorizontal: 14,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  countryText: {
    fontSize: 12,
    color: '#A8A8A8',
  },
  chevron: {
    fontSize: 16,
    color: '#777',
  },

  termsRow: {
    marginHorizontal: 18,
    marginTop: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkedBox: {
    width: 14,
    height: 14,
    borderRadius: 3,
    backgroundColor: '#1F2A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkedText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  termsText: {
    marginLeft: 8,
    fontSize: 10,
    color: '#777',
  },

  payWithRow: {
    marginHorizontal: 18,
    marginTop: 18,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#DFDFDF',
  },
  payWithText: {
    marginHorizontal: 12,
    fontSize: 10,
    color: '#9A9A9A',
  },

  walletButton: {
    marginHorizontal: 18,
    height: 43,
    borderRadius: 22,
    backgroundColor: '#EFEFEF',
    borderWidth: 1,
    borderColor: '#D8D8D8',
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  appleLogo: {
    fontSize: 18,
    color: '#000',
    marginRight: 8,
  },
  googleLogo: {
    fontSize: 16,
    fontWeight: '800',
    color: '#000',
    marginRight: 8,
  },
  walletText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111',
  },

  continueButton: {
    marginHorizontal: 18,
    marginTop: 8,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#1F2A2B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});

export default PaymentMethodScreen;