// ============================================================
// Navigation — React Navigation setup
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Auth ──
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import Welcome2Screen from "../screens/auth/Welcome2Screen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// ── Home / Search ──
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/home/SearchScreen";
import FiltersScreen from "../screens/home/FiltersScreen";

// ── Cars ──
import CarDetailScreen from "../screens/cars/CarDetailScreen";
import ReviewsScreen from "../screens/cars/ReviewsScreen";

// ── Bookings / Payment ──
import BookingScreen from "../screens/bookings/BookingScreen";
import PaymentScreen from "../screens/bookings/PaymentScreen";
import PaymentSuccessScreen from "../screens/bookings/PaymentSuccessScreen";

// ── Inbox / Chat ──
import InboxScreen from "../screens/inbox/InboxScreen";
import ChatScreen from "../screens/inbox/ChatScreen";

// ── Notifications ──
import NotificationsScreen from "../screens/notifications/NotificationsScreen";

// ── Profile ──
import ProfileScreen from "../screens/profile/ProfileScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";

// ── Admin ──
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";

// ── Icons ──
import {
  HomeIcon,
  SearchIcon,
  InboxIcon,
  BellIcon,
  UserIcon,
} from "../components/common/Icons";

// ── Placeholder per screens qe ende s'jane krijuar ──
const Placeholder = ({ route }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{route.name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Custom Bottom Tab Bar ──
const CustomTabBar = ({ state, navigation }) => (
  <SafeAreaView edges={["bottom"]} style={styles.tabBarWrapper}>
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const onPress = () => {
          if (!isFocused) navigation.navigate(route.name);
        };

        let Icon;
        if (route.name === "Home") Icon = HomeIcon;
        else if (route.name === "Search") Icon = SearchIcon;
        else if (route.name === "Inbox") Icon = InboxIcon;
        else if (route.name === "Notifications") Icon = BellIcon;
        else if (route.name === "Profile") Icon = UserIcon;

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            style={styles.tabBtn}
            activeOpacity={0.7}
          >
            <Icon
              size={22}
              color={isFocused ? "#fff" : "rgba(255,255,255,0.5)"}
            />
          </TouchableOpacity>
        );
      })}
    </View>
  </SafeAreaView>
);

// ── Bottom Tabs ──
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Inbox" component={InboxScreen} />
    <Tab.Screen name="Notifications" component={NotificationsScreen} />
    <Tab.Screen name="Profile" component={ProfileScreen} />
  </Tab.Navigator>
);

// ── Main Navigation ──
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Welcome2" component={Welcome2Screen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main (customer / car owner) */}
      <Stack.Screen
        name="MainTabs"
        component={MainTabs}
        options={{ gestureEnabled: false }}
      />

      {/* Admin */}
      <Stack.Screen
        name="AdminDashboard"
        component={AdminDashboardScreen}
        options={{ gestureEnabled: false }}
      />

      {/* Modal / Detail */}
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={PaymentScreen} />
      <Stack.Screen name="PaymentSuccess" component={PaymentSuccessScreen} />
      <Stack.Screen name="ChatConversation" component={ChatScreen} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} />
      <Stack.Screen name="MyBookings" component={Placeholder} />
      <Stack.Screen name="Favorites" component={Placeholder} />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: "absolute",
    left: 20,
    right: 20,
    bottom: 14,
    backgroundColor: "transparent",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#2D2D2D",
    borderRadius: 40,
    paddingVertical: 16,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 4,
  },
});

export default AppNavigator;
