import React from "react";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import {
  createBottomTabNavigator,
} from "@react-navigation/bottom-tabs";

import LoginScreen from "../screens/LoginScreen";
import MenuScreen from "../screens/MenuScreen";
import CartScreen from "../screens/CartScreen";
import OrderSummaryScreen from "../screens/OrderSummaryScreen";
import OrderTrackingScreen from "../screens/OrderTrackingScreen";
import ReservationScreen from "../screens/ReservationScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ManagerDashboard from "../screens/ManagerDashboard";

import useAuth from "../hooks/useAuth";

const Stack =
  createNativeStackNavigator();

const Tab =
  createBottomTabNavigator();

function CustomerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="MenuTab"
        component={MenuScreen}
        options={{
          title: "Menu",
        }}
      />

      <Tab.Screen
        name="CartTab"
        component={CartScreen}
        options={{
          title: "Cart",
        }}
      />

      <Tab.Screen
        name="ReservationTab"
        component={ReservationScreen}
        options={{
          title: "Reservation",
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

function ManagerTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="ManagerDashboardTab"
        component={ManagerDashboard}
        options={{
          title: "Dashboard",
        }}
      />

      <Tab.Screen
        name="ManagerProfile"
        component={ProfileScreen}
        options={{
          title: "Profile",
        }}
      />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            headerShown: false,
          }}
        />
      ) : user.role === "manager" ? (
        <>
          <Stack.Screen
            name="Manager"
            component={ManagerTabs}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="OrderTracking"
            component={OrderTrackingScreen}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Customer"
            component={CustomerTabs}
            options={{
              headerShown: false,
            }}
          />

          <Stack.Screen
            name="OrderSummary"
            component={OrderSummaryScreen}
          />

          <Stack.Screen
            name="OrderTracking"
            component={OrderTrackingScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}