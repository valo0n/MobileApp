import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
  Share,
} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import Svg, { Path, Circle } from "react-native-svg";
import {
  BackIcon,
  MoreIcon,
  HeartIcon,
  BellIcon,
} from "../../components/common/Icons";
import { AuthService } from "../../services";

// ── Icons per menu ──
const ClockIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 7V12L15 14"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const PartnerIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="8" cy="8" r="3" stroke={color} strokeWidth="1.8" />
    <Circle cx="16" cy="16" r="3" stroke={color} strokeWidth="1.8" />
    <Path
      d="M10.5 10.5L13.5 13.5"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const SettingsIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="3" stroke={color} strokeWidth="1.8" />
    <Path
      d="M12 2V4M12 20V22M4 12H2M22 12H20M5 5L6.5 6.5M17.5 17.5L19 19M19 5L17.5 6.5M6.5 17.5L5 19"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const LangIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 5H11M7.5 5V3M9 5C9 9 6 12 3 13M5 9C5 11 7.5 13 10 13"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <Path
      d="M13 21L17 11L21 21M14.5 17.5H19.5"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const InviteIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Circle cx="9" cy="8" r="3.5" stroke={color} strokeWidth="1.8" />
    <Path
      d="M3 20C3 16.5 5.5 14 9 14C10.5 14 11.8 14.4 13 15.2"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M18 11V17M15 14H21"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
  </Svg>
);
const PrivacyIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M7 3H14L19 8V21H7C6 21 5 20 5 19V5C5 4 6 3 7 3Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinejoin="round"
    />
    <Path
      d="M9 12H15M9 16H13"
      stroke={color}
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </Svg>
);
const HelpIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M4 14V12C4 7.5 7.5 4 12 4C16.5 4 20 7.5 20 12V14"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M4 14C4 13 4.5 12.5 5.5 12.5H6V17H5.5C4.5 17 4 16.5 4 15.5V14Z"
      stroke={color}
      strokeWidth="1.8"
    />
    <Path
      d="M20 14C20 13 19.5 12.5 18.5 12.5H18V17H18.5C19.5 17 20 16.5 20 15.5V14Z"
      stroke={color}
      strokeWidth="1.8"
    />
  </Svg>
);
const LogoutIcon = ({ color = "#111" }) => (
  <Svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <Path
      d="M14 8V6C14 5 13 4 12 4H6C5 4 4 5 4 6V18C4 19 5 20 6 20H12C13 20 14 19 14 18V16"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
    />
    <Path
      d="M9 12H20M9 12L12 9M9 12L12 15"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      transform="scale(-1,1) translate(-29,0)"
    />
  </Svg>
);
const Chevron = () => (
  <Svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <Path
      d="M9 6L15 12L9 18"
      stroke="#9CA3AF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
const EditIcon = ({ color = "#9CA3AF" }) => (
  <Svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4V20H20V13M18.5 2.5C19.3 1.7 20.7 1.7 21.5 2.5C22.3 3.3 22.3 4.7 21.5 5.5L12 15L8 16L9 12L18.5 2.5Z"
      stroke={color}
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      const res = await AuthService.getProfile();
      setUser(res.data);
    } catch (e) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, []),
  );

  const handleLogout = () => {
    Alert.alert("Log out", "A je i sigurt qe don me dal?", [
      { text: "Jo", style: "cancel" },
      {
        text: "Po, Dil",
        style: "destructive",
        onPress: async () => {
          await SecureStore.deleteItemAsync("auth_token");
          navigation.reset({ index: 0, routes: [{ name: "Login" }] });
        },
      },
    ]);
  };
  const handleInvite = async () => {
    try {
      await Share.share({
        message: "Join me on QENT — rent cars easily! Download the app.",
      });
    } catch (e) {}
  };
  const generalMenu = [
    {
      icon: HeartIcon,
      label: "Favorite Cars",
      onPress: () => navigation.navigate("Favorites"),
    },
    {
      icon: ClockIcon,
      label: "Previous Rant",
      onPress: () => navigation.navigate("MyBookings"),
    },
    {
      icon: BellIcon,
      label: "Notification",
      onPress: () => navigation.navigate("Notifications"),
    },
    {
      icon: PartnerIcon,
      label: "Connected to QENT Partnerships",
      onPress: () => navigation.navigate("PartnerWelcome"),
    },
  ];

  const supportMenu = [
    {
      icon: SettingsIcon,
      label: "Settings",
      onPress: () => navigation.navigate("Settings"),
    },
    {
      icon: LangIcon,
      label: "Languages",
      onPress: () => navigation.navigate("Languages"),
    },
    { icon: InviteIcon, label: "Invite Friends", onPress: handleInvite },
    {
      icon: PrivacyIcon,
      label: "privacy policy",
      onPress: () => navigation.navigate("PrivacyPolicy"),
    },
    {
      icon: HelpIcon,
      label: "Help Support",
      onPress: () => navigation.navigate("HelpSupport"),
    },
    { icon: LogoutIcon, label: "Log out", onPress: handleLogout },
  ];

  const renderRow = (item, i) => (
    <TouchableOpacity
      key={i}
      style={styles.row}
      onPress={item.onPress}
      activeOpacity={0.7}
    >
      <View style={styles.rowIcon}>
        <item.icon color="#111" />
      </View>
      <Text style={styles.rowLabel}>{item.label}</Text>
      <Chevron />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" color="#111" />
        </View>
      </SafeAreaView>
    );
  }

  const fullName = user ? `${user.first_name} ${user.last_name}` : "Guest User";
  const email = user?.email || "guest@qent.com";
  const avatar = user?.avatar_url || "https://i.pravatar.cc/150?img=12";

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.iconBtn}
          onPress={() => navigation.goBack()}
        >
          <BackIcon size={20} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.iconBtn}>
          <MoreIcon size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 110 }}
      >
        {/* User card */}
        <View style={styles.userCard}>
          <Image source={{ uri: avatar }} style={styles.userAvatar} />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{fullName}</Text>
            <Text style={styles.userEmail}>{email}</Text>
          </View>
          <TouchableOpacity
            style={styles.editProfile}
            onPress={() => navigation.navigate("EditProfile", { user })}
          >
            <EditIcon color="#9CA3AF" />
            <Text style={styles.editProfileText}>Edit profile</Text>
          </TouchableOpacity>
        </View>

        {/* General */}
        <Text style={styles.sectionTitle}>General</Text>
        <View style={styles.menuGroup}>{generalMenu.map(renderRow)}</View>

        {/* Support */}
        <Text style={styles.sectionTitle}>Saport</Text>
        <View style={styles.menuGroup}>{supportMenu.map(renderRow)}</View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },
  loadingWrap: { flex: 1, justifyContent: "center", alignItems: "center" },
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
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  userAvatar: { width: 64, height: 64, borderRadius: 32, marginRight: 14 },
  userInfo: { flex: 1 },
  userName: { fontSize: 17, fontWeight: "700", color: "#111" },
  userEmail: { fontSize: 13, color: "#9CA3AF", marginTop: 2 },
  editProfile: { alignItems: "center" },
  editProfileText: { fontSize: 11, color: "#9CA3AF", marginTop: 4 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#111",
    paddingHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
  },
  menuGroup: { paddingHorizontal: 20 },
  row: { flexDirection: "row", alignItems: "center", paddingVertical: 14 },
  rowIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 14,
  },
  rowLabel: { flex: 1, fontSize: 14, color: "#111" },
});

export default ProfileScreen;
