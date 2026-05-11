// ============================================================
// Navigation — React Navigation setup
// ============================================================

import React from "react";
import { View, Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

// ── Real Screens ──
import WelcomeScreen from "../screens/auth/WelcomeScreen";
import Welcome2Screen from "../screens/auth/Welcome2Screen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";

// ── Placeholder for screens not yet built ──
const Placeholder = ({ route }) => (
  <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
    <Text>{route.name} Screen</Text>
  </View>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ── Bottom Tabs ──
const MainTabs = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Home" component={Placeholder} />
    <Tab.Screen name="MyBookings" component={Placeholder} />
    <Tab.Screen name="Favorites" component={Placeholder} />
    <Tab.Screen name="Chat" component={Placeholder} />
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
      <Stack.Screen name="Onboarding" component={Placeholder} />

      {/* Main App */}
      <Stack.Screen name="MainTabs" component={MainTabs} />

      {/* Detail Screens */}
      <Stack.Screen name="Search" component={Placeholder} />
      <Stack.Screen name="CarDetail" component={Placeholder} />
      <Stack.Screen name="Booking" component={Placeholder} />
      <Stack.Screen name="Payment" component={Placeholder} />
      <Stack.Screen name="ChatConversation" component={Placeholder} />
      <Stack.Screen name="Notifications" component={Placeholder} />
      <Stack.Screen name="EditProfile" component={Placeholder} />
    </Stack.Navigator>
  </NavigationContainer>
);

export default AppNavigator;
