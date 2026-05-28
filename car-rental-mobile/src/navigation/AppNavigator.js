// ============================================================
// Navigation — React Navigation setup
// ============================================================

import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { SafeAreaView } from "react-native-safe-area-context";

// ── Real Screens ──
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import Welcome2Screen from "../screens/auth/Welcome2Screen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import HomeScreen from "../screens/home/HomeScreen";
import SearchScreen from "../screens/home/SearchScreen";
import FiltersScreen from "../screens/home/FiltersScreen";
import CarDetailScreen from "../screens/cars/CarDetailScreen";
import ReviewsScreen from "../screens/cars/ReviewsScreen";
import BookingScreen from "../screens/bookings/BookingScreen";
import AdminDashboardScreen from "../screens/admin/AdminDashboardScreen";

// ── Icons ──
import {
  HomeIcon,
  SearchIcon,
  InboxIcon,
  BellIcon,
  UserIcon,
} from "../components/common/Icons";

// ── Placeholder ──
const Placeholder = ({ route }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{route.name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Custom Bottom Tab Bar ──
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
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
};

// ── Bottom Tabs ──
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={{ headerShown: false }}
    tabBar={(props) => <CustomTabBar {...props} />}
  >
    <Tab.Screen name="Home" component={HomeScreen} />
    <Tab.Screen name="Search" component={SearchScreen} />
    <Tab.Screen name="Inbox" component={Placeholder} />
    <Tab.Screen name="Notifications" component={Placeholder} />
    <Tab.Screen name="Profile" component={Placeholder} />
  </Tab.Navigator>
);

// ── Main Navigation ──
const AppNavigator = () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      {/* Auth Flow */}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="Welcome2" component={Welcome2Screen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Register" component={RegisterScreen} />

      {/* Main App (customer / car owner) */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Admin */}
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />

      {/* Modal / Detail Screens */}
      <Stack.Screen
        name="Filters"
        component={FiltersScreen}
        options={{ presentation: "modal", animation: "slide_from_bottom" }}
      />
      <Stack.Screen name="CarDetail" component={CarDetailScreen} />
      <Stack.Screen name="Reviews" component={ReviewsScreen} />
      <Stack.Screen name="Booking" component={BookingScreen} />
      <Stack.Screen name="Payment" component={Placeholder} />
      <Stack.Screen name="ChatConversation" component={Placeholder} />
      <Stack.Screen name="EditProfile" component={Placeholder} />
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
