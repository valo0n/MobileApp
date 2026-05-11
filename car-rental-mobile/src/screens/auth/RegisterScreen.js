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
  Alert,
} from 'react-native';
import QentLogo from '../../components/common/QentLogo';
import { useAuthViewModel } from '../../viewmodels';

const RegisterScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [country, setCountry] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { register, loading } = useAuthViewModel();

  const handleSignUp = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    // Split full name into first + last
    const parts = fullName.trim().split(' ');
    const first_name = parts[0];
    const last_name = parts.slice(1).join(' ') || parts[0];

    try {
      await register({ first_name, last_name, email, password });
      navigation.replace('MainTabs');
    } catch (err) {
      Alert.alert('Sign Up Failed', err.message || 'Could not create account');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
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
          <Text style={styles.heading}>Sign Up</Text>

          {/* Full Name */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              placeholderTextColor="#9CA3AF"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* Email */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Email Address"
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
              <Text style={styles.eyeIcon}>{showPassword ? '👁' : '👁‍🗨'}</Text>
            </TouchableOpacity>
          </View>

          {/* Country */}
          <View style={styles.inputBox}>
            <TextInput
              style={styles.input}
              placeholder="Country"
              placeholderTextColor="#9CA3AF"
              value={country}
              onChangeText={setCountry}
            />
          </View>

          {/* Sign up button */}
          <TouchableOpacity
            style={styles.signUpBtn}
            activeOpacity={0.85}
            onPress={handleSignUp}
            disabled={loading}
          >
            <Text style={styles.signUpBtnText}>
              {loading ? 'Loading...' : 'Sing up'}
            </Text>
          </TouchableOpacity>

          {/* Login button */}
          <TouchableOpacity
            style={styles.loginBtn}
            activeOpacity={0.85}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.footerLink}>Login.</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F5' },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 40,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 30,
  },
  brandName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111',
    marginLeft: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111',
    textAlign: 'center',
    marginBottom: 28,
  },
  inputBox: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 18,
    paddingVertical: 4,
    marginBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: { flex: 1, fontSize: 15, color: '#111', paddingVertical: 16 },
  eye: { padding: 4 },
  eyeIcon: { fontSize: 18, color: '#9CA3AF' },
  signUpBtn: {
    backgroundColor: '#2D2D2D',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 12,
  },
  signUpBtnText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loginBtn: {
    backgroundColor: '#E8E8E8',
    paddingVertical: 18,
    borderRadius: 50,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginBtnText: { color: '#111', fontSize: 16, fontWeight: '600' },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
  },
  footerText: { color: '#6B7280', fontSize: 14 },
  footerLink: { color: '#111', fontSize: 14, fontWeight: '600' },
});

export default RegisterScreen;