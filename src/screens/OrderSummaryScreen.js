import React, { useMemo, useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";

import { useCart } from "../context/CartContext";
import { useOrders } from "../context/OrdersContext";
import useTheme from "../hooks/useTheme";

const SERVICE_CHARGE_RATE = 0.05;
const SALES_TAX_RATE = 0.15;

export default function OrderSummaryScreen({
  navigation,
}) {
  const { state, dispatch } = useCart();
  const { addOrder } = useOrders();
  const { theme } = useTheme();

  const [orderType, setOrderType] =
    useState("Takeaway");

  const [tableNumber, setTableNumber] =
    useState("");

  const [pickupTime, setPickupTime] =
    useState("20:00");

  const subtotal = useMemo(
    () =>
      state.items.reduce(
        (total, item) =>
          total + item.price * item.quantity,
        0
      ),
    [state.items]
  );

  const discount = useMemo(
    () =>
      subtotal *
      (state.discountPercent / 100),
    [subtotal, state.discountPercent]
  );

  const serviceCharge = useMemo(
    () =>
      (subtotal - discount) *
      SERVICE_CHARGE_RATE,
    [subtotal, discount]
  );

  const salesTax = useMemo(
    () =>
      (subtotal - discount) *
      SALES_TAX_RATE,
    [subtotal, discount]
  );

  const grandTotal = useMemo(
    () =>
      subtotal -
      discount +
      serviceCharge +
      salesTax,
    [subtotal, discount, serviceCharge, salesTax]
  );

  const placeOrder = () => {
    if (
      orderType === "Dine-in" &&
      !tableNumber
    ) {
      Alert.alert(
        "Table Required",
        "Please enter a table number."
      );
      return;
    }

    const order = {
      id: Date.now().toString(),
      items: state.items,
      total: grandTotal,
      type: orderType,
      tableNumber:
        orderType === "Dine-in"
          ? tableNumber
          : null,
      pickupTime:
        orderType === "Takeaway"
          ? pickupTime
          : null,
      status: "Pending",
      timestamp: Date.now(),
    };

    addOrder(order);

    dispatch({
      type: "CLEAR_CART",
    });

    navigation.replace("OrderTracking", {
      orderId: order.id,
    });
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <Text
        style={[
          styles.title,
          { color: theme.text },
        ]}
      >
        Order Summary
      </Text>

      <Text style={{ color: theme.text }}>
        Subtotal: Rs. {subtotal.toFixed(0)}
      </Text>

      <Text style={{ color: theme.text }}>
        Promo Discount: Rs. {discount.toFixed(0)}
      </Text>

      <Text style={{ color: theme.text }}>
        Service Charge (5%): Rs.{" "}
        {serviceCharge.toFixed(0)}
      </Text>

      <Text style={{ color: theme.text }}>
        Sales Tax (15%): Rs.{" "}
        {salesTax.toFixed(0)}
      </Text>

      <Text
        style={[
          styles.total,
          { color: theme.text },
        ]}
      >
        Grand Total: Rs.{" "}
        {grandTotal.toFixed(0)}
      </Text>

      <Text
        style={[
          styles.label,
          { color: theme.text },
        ]}
      >
        Order Type
      </Text>

      <View style={styles.row}>
        <TouchableOpacity
          style={[
            styles.option,
            orderType === "Dine-in" &&
              styles.selected,
          ]}
          onPress={() => setOrderType("Dine-in")}
        >
          <Text>Dine-in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.option,
            orderType === "Takeaway" &&
              styles.selected,
          ]}
          onPress={() =>
            setOrderType("Takeaway")
          }
        >
          <Text>Takeaway</Text>
        </TouchableOpacity>
      </View>

      {orderType === "Dine-in" ? (
        <TouchableOpacity
          style={styles.inputButton}
          onPress={() =>
            setTableNumber("3")
          }
        >
          <Text>
            {tableNumber
              ? `Table ${tableNumber} selected`
              : "Select Table 3"}
          </Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={styles.inputButton}
          onPress={() =>
            setPickupTime("20:00")
          }
        >
          <Text>
            Pickup Time: {pickupTime}
          </Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={styles.placeButton}
        onPress={placeOrder}
      >
        <Text style={styles.placeText}>
          Place Order
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  total: {
    fontSize: 21,
    fontWeight: "bold",
    marginVertical: 15,
  },

  label: {
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 10,
  },

  row: {
    flexDirection: "row",
    gap: 10,
  },

  option: {
    flex: 1,
    padding: 14,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    alignItems: "center",
  },

  selected: {
    backgroundColor: "#ddd",
  },

  inputButton: {
    padding: 15,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    marginTop: 15,
    backgroundColor: "#fff",
  },

  placeButton: {
    backgroundColor: "#222",
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  placeText: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "bold",
  },
});