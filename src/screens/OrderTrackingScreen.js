import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  StyleSheet,
} from "react-native";

import { useOrders } from "../context/OrdersContext";

const statuses = [
  "Pending",
  "Preparing",
  "Ready",
  "Served",
];

export default function OrderTrackingScreen({
  route,
}) {
  const { orderId } = route.params;

  const { orders, updateStatus } = useOrders();

  const order = orders.find(
    (item) => item.id === orderId
  );

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    if (!order) return;

    const timer = setInterval(() => {
      const seconds = Math.floor(
        (Date.now() - order.timestamp) / 1000
      );

      setElapsed(seconds);

      if (seconds >= 30) {
        updateStatus(order.id, "Served");
      } else if (seconds >= 20) {
        updateStatus(order.id, "Ready");
      } else if (seconds >= 10) {
        updateStatus(order.id, "Preparing");
      }
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, [order?.id]);

  if (!order) {
    return (
      <View style={styles.center}>
        <Text>Order not found.</Text>
      </View>
    );
  }

  const currentIndex =
    statuses.indexOf(order.status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Order Tracking
      </Text>

      <Text style={styles.orderId}>
        Order #{order.id}
      </Text>

      <Text style={styles.elapsed}>
        Elapsed Time: {elapsed} seconds
      </Text>

      {statuses.map((status, index) => (
        <View
          key={status}
          style={styles.step}
        >
          <View
            style={[
              styles.circle,
              index <= currentIndex &&
                styles.activeCircle,
            ]}
          >
            <Text style={styles.circleText}>
              {index <= currentIndex ? "✓" : ""}
            </Text>
          </View>

          <Text
            style={[
              styles.status,
              index <= currentIndex &&
                styles.activeStatus,
            ]}
          >
            {status}
          </Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 25,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
  },

  orderId: {
    color: "#666",
    marginBottom: 10,
  },

  elapsed: {
    fontSize: 17,
    marginBottom: 30,
  },

  step: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 25,
  },

  circle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: "#aaa",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  activeCircle: {
    backgroundColor: "#222",
    borderColor: "#222",
  },

  circleText: {
    color: "#fff",
    fontWeight: "bold",
  },

  status: {
    fontSize: 18,
    color: "#999",
  },

  activeStatus: {
    color: "#222",
    fontWeight: "bold",
  },
});