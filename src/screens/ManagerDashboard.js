import React, { useState } from "react";

import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";

import { useOrders } from "../context/OrdersContext";
import menu from "../data/menu";
import useAuth from "../hooks/useAuth";

export default function ManagerDashboard() {
  const { user } = useAuth();
  const { orders, updateStatus } =
    useOrders();

  const [tab, setTab] =
    useState("orders");

  const [menuItems, setMenuItems] =
    useState(menu);

  const [newName, setNewName] =
    useState("");

  const [newPrice, setNewPrice] =
    useState("");

  if (user?.role !== "manager") {
    return (
      <View style={styles.center}>
        <Text>Access denied.</Text>
      </View>
    );
  }

  const addMenuItem = () => {
    if (!newName || !newPrice) {
      Alert.alert(
        "Error",
        "Enter item name and price."
      );
      return;
    }

    const newItem = {
      id: Date.now().toString(),
      name: newName,
      description: "New restaurant item",
      price: Number(newPrice),
      category: "Mains",
      image:
        "https://images.unsplash.com/photo-1546069901-ba9599a7e63c",
      isSpecial: false,
      isAvailable: true,
    };

    setMenuItems((current) => [
      ...current,
      newItem,
    ]);

    setNewName("");
    setNewPrice("");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Manager Dashboard
      </Text>

      <View style={styles.tabs}>
        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTab("orders")}
        >
          <Text>Orders</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() =>
            setTab("reservations")
          }
        >
          <Text>Reservations</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.tab}
          onPress={() => setTab("menu")}
        >
          <Text>Menu</Text>
        </TouchableOpacity>
      </View>

      {tab === "orders" && (
        <FlatList
          data={orders}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text>No incoming orders.</Text>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.bold}>
                Order #{item.id}
              </Text>

              <Text>
                Total: Rs.{" "}
                {item.total.toFixed(0)}
              </Text>

              <Text>
                Type: {item.type}
              </Text>

              <Text>
                Status: {item.status}
              </Text>

              <View style={styles.statusRow}>
                {[
                  "Pending",
                  "Preparing",
                  "Ready",
                  "Served",
                ].map((status) => (
                  <TouchableOpacity
                    key={status}
                    style={styles.statusButton}
                    onPress={() =>
                      updateStatus(
                        item.id,
                        status
                      )
                    }
                  >
                    <Text style={styles.smallText}>
                      {status}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        />
      )}

      {tab === "reservations" && (
        <View>
          <Text style={styles.heading}>
            Reservations
          </Text>

          <Text>
            Reservation management is ready for
            local mock reservations.
          </Text>

          <TouchableOpacity
            style={styles.accept}
            onPress={() =>
              Alert.alert(
                "Reservation",
                "Reservation accepted."
              )
            }
          >
            <Text style={styles.white}>
              Accept Reservation
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.decline}
            onPress={() =>
              Alert.alert(
                "Reservation",
                "Reservation declined."
              )
            }
          >
            <Text style={styles.white}>
              Decline Reservation
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {tab === "menu" && (
        <View>
          <Text style={styles.heading}>
            Menu Management
          </Text>

          <TextInput
            style={styles.input}
            placeholder="New item name"
            value={newName}
            onChangeText={setNewName}
          />

          <TextInput
            style={styles.input}
            placeholder="Price"
            keyboardType="numeric"
            value={newPrice}
            onChangeText={setNewPrice}
          />

          <TouchableOpacity
            style={styles.add}
            onPress={addMenuItem}
          >
            <Text style={styles.white}>
              Add Item
            </Text>
          </TouchableOpacity>

          {menuItems.map((item) => (
            <View
              key={item.id}
              style={styles.menuRow}
            >
              <View>
                <Text style={styles.bold}>
                  {item.name}
                </Text>

                <Text>
                  Rs. {item.price}
                </Text>
              </View>

              <TouchableOpacity
                onPress={() =>
                  setMenuItems((current) =>
                    current.map((menuItem) =>
                      menuItem.id === item.id
                        ? {
                            ...menuItem,
                            isAvailable:
                              !menuItem.isAvailable,
                          }
                        : menuItem
                    )
                  )
                }
              >
                <Text>
                  {item.isAvailable
                    ? "Available"
                    : "Unavailable"}
                </Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 27,
    fontWeight: "bold",
    marginBottom: 15,
  },

  tabs: {
    flexDirection: "row",
    marginBottom: 15,
    gap: 6,
  },

  tab: {
    flex: 1,
    backgroundColor: "#ddd",
    padding: 12,
    alignItems: "center",
    borderRadius: 8,
  },

  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
  },

  bold: {
    fontWeight: "bold",
  },

  statusRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 5,
    marginTop: 10,
  },

  statusButton: {
    backgroundColor: "#222",
    padding: 7,
    borderRadius: 5,
  },

  smallText: {
    color: "#fff",
    fontSize: 11,
  },

  heading: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },

  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
  },

  add: {
    backgroundColor: "#222",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 15,
  },

  white: {
    color: "#fff",
    fontWeight: "bold",
  },

  menuRow: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  accept: {
    backgroundColor: "green",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },

  decline: {
    backgroundColor: "red",
    padding: 13,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
});