import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Switch,
  StatusBar,
  Linking,
} from "react-native";
import { BackIcon } from "../../components/common/Icons";

// ── Shared header ──
const Header = ({ title, navigation }) => (
  <View style={s.header}>
    <TouchableOpacity style={s.iconBtn} onPress={() => navigation.goBack()}>
      <BackIcon size={20} color="#111" />
    </TouchableOpacity>
    <Text style={s.headerTitle}>{title}</Text>
    <View style={{ width: 40 }} />
  </View>
);

// ============================================================
// SETTINGS
// ============================================================
export const SettingsScreen = ({ navigation }) => {
  const [push, setPush] = useState(true);
  const [emailN, setEmailN] = useState(true);
  const [sms, setSms] = useState(false);
  const [dark, setDark] = useState(false);

  const Toggle = ({ label, value, onChange }) => (
    <View style={s.toggleRow}>
      <Text style={s.toggleLabel}>{label}</Text>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: "#2D2D2D", false: "#D1D5DB" }}
        thumbColor="#fff"
      />
    </View>
  );

  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Header title="Settings" navigation={navigation} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={s.section}>Notifications</Text>
        <View style={s.group}>
          <Toggle label="Push notifications" value={push} onChange={setPush} />
          <Toggle
            label="Email notifications"
            value={emailN}
            onChange={setEmailN}
          />
          <Toggle label="SMS notifications" value={sms} onChange={setSms} />
        </View>
        <Text style={s.section}>Appearance</Text>
        <View style={s.group}>
          <Toggle label="Dark mode" value={dark} onChange={setDark} />
        </View>
        <Text style={s.section}>Account</Text>
        <View style={s.group}>
          <TouchableOpacity
            style={s.linkRow}
            onPress={() => navigation.navigate("EditProfile")}
          >
            <Text style={s.toggleLabel}>Edit profile</Text>
            <Text style={s.chev}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================
// LANGUAGES
// ============================================================
export const LanguagesScreen = ({ navigation }) => {
  const [selected, setSelected] = useState("en");
  const langs = [{ code: "en", label: "English" }];
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Header title="Languages" navigation={navigation} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={s.group}>
          {langs.map((l) => (
            <TouchableOpacity
              key={l.code}
              style={s.linkRow}
              onPress={() => setSelected(l.code)}
            >
              <Text style={s.toggleLabel}>{l.label}</Text>
              {selected === l.code && <Text style={s.check}>✓</Text>}
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ============================================================
// PRIVACY POLICY
// ============================================================
export const PrivacyPolicyScreen = ({ navigation }) => (
  <SafeAreaView style={s.container}>
    <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
    <Header title="Privacy Policy" navigation={navigation} />
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={s.p}>
        QENT respects your privacy. This policy explains what data we collect,
        how we use it, and the choices you have.
      </Text>
      <Text style={s.h}>1. Information we collect</Text>
      <Text style={s.p}>
        Account details (name, email, phone), booking history, payment metadata,
        and device information used to improve the service.
      </Text>
      <Text style={s.h}>2. How we use it</Text>
      <Text style={s.p}>
        To process bookings and payments, provide support, prevent fraud, and
        send service notifications you have enabled.
      </Text>
      <Text style={s.h}>3. Sharing</Text>
      <Text style={s.p}>
        We share data only with car owners involved in your booking and with
        payment providers. We never sell your personal data.
      </Text>
      <Text style={s.h}>4. Your rights</Text>
      <Text style={s.p}>
        You can edit or delete your account at any time. Contact us to request a
        copy of your data.
      </Text>
      <Text style={[s.p, { marginTop: 16, color: "#9CA3AF" }]}>
        Last updated: {new Date().getFullYear()}
      </Text>
    </ScrollView>
  </SafeAreaView>
);

// ============================================================
// HELP & SUPPORT
// ============================================================
export const HelpSupportScreen = ({ navigation }) => {
  const options = [
    {
      label: "Email us",
      sub: "support@qent.com",
      action: () => Linking.openURL("mailto:support@qent.com"),
    },
    {
      label: "Call us",
      sub: "+1 800 123 456",
      action: () => Linking.openURL("tel:+1800123456"),
    },
    {
      label: "FAQ",
      sub: "Common questions",
      action: () => {},
    },
  ];
  return (
    <SafeAreaView style={s.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />
      <Header title="Help Support" navigation={navigation} />
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <View style={s.group}>
          {options.map((o, i) => (
            <TouchableOpacity key={i} style={s.linkRow} onPress={o.action}>
              <View>
                <Text style={s.toggleLabel}>{o.label}</Text>
                <Text style={s.sub}>{o.sub}</Text>
              </View>
              <Text style={s.chev}>›</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: "#111" },
  section: {
    fontSize: 14,
    fontWeight: "700",
    color: "#6B7280",
    marginTop: 18,
    marginBottom: 8,
  },
  group: {
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: "#ECECEC",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  linkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  toggleLabel: { fontSize: 15, color: "#111" },
  sub: { fontSize: 12, color: "#9CA3AF", marginTop: 2 },
  chev: { fontSize: 22, color: "#9CA3AF" },
  check: { fontSize: 16, color: "#2563EB", fontWeight: "700" },
  h: {
    fontSize: 15,
    fontWeight: "700",
    color: "#111",
    marginTop: 16,
    marginBottom: 6,
  },
  p: { fontSize: 14, color: "#374151", lineHeight: 21 },
});
