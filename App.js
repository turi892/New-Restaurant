import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import { SafeAreaProvider } from "react-native-safe-area-context";

import {
  AuthProvider,
} from "./src/context/AuthContext";

import {
  ThemeProvider,
} from "./src/context/ThemeContext";

import {
  CartProvider,
} from "./src/context/CartContext";

import {
  OrdersProvider,
} from "./src/context/OrdersContext";

import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ThemeProvider>
          <CartProvider>
            <OrdersProvider>
              <NavigationContainer>
                <AppNavigator />
              </NavigationContainer>
            </OrdersProvider>
          </CartProvider>
        </ThemeProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}