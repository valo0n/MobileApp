import React from "react";
import { StripeProvider } from "@stripe/stripe-react-native";
import AppNavigator from "./src/navigation/AppNavigator";

// Vendos publishable key-in test (pk_test_...) ketu ose te .env si
// EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY
const STRIPE_PUBLISHABLE_KEY =
  process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY ||
  "pk_test_51TdrE03pznhVTsfxaVxjGpCovilAiESMikrYJK6mk7DejdVDE4tTJM7uDzHG9VaC85VeIDOCADzWRuBPX9VFfeyu008t12soCX";

export default function App() {
  return (
    <StripeProvider publishableKey={STRIPE_PUBLISHABLE_KEY}>
      <AppNavigator />
    </StripeProvider>
  );
}
