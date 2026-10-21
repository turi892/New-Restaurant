import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from "react-native";

import tables from "../data/tables";
import useReservation from "../hooks/useReservation";

export default function ReservationScreen() {
  const [reservations, setReservations] =
    useState([]);

  const {
    date,
    setDate,
    time,
    setTime,
    partySize,
    setPartySize,
    selectedTable,
    setSelectedTable,
    name,
    setName,
    phone,
    setPhone,
    timeSlots,
    availableTables,
    createReservation,
    cancelReservation,
  } = useReservation(
    reservations,
    setReservations
  );

  const handleCreate = () => {
    const result = createReservation();

    if (!result.success) {
      Alert.alert("Error", result.message);
      return;
    }

    Alert.alert(
      "Reservation Created",
      `Table ${result.reservation.tableId} reserved successfully.`
    );
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>
        Reserve a Table 🍽️
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Date YYYY-MM-DD"
        value={date}
        onChangeText={setDate}
      />

      <TextInput
        style={styles.input}
        placeholder="Phone 0300-1234567"
        value={phone}
        onChangeText={setPhone}
        keyboardType="phone-pad"
      />

      <TextInput
        style={styles.input}
        placeholder="Number of Guests"
        value={partySize}
        onChangeText={setPartySize}
        keyboardType="numeric"
      />

      <Text style={styles.heading}>
        Select Time
      </Text>

      <View style={styles.wrap}>
        {timeSlots.map((slot) => {
          const free =
            date &&
            partySize &&
            tables.some(
              (table) =>
                table.capacity >=
                  Number(partySize) &&
                table.available
            );

          return (
            <TouchableOpacity
              key={slot}
              disabled={!free}
              style={[
                styles.slot,
                time === slot &&
                  styles.selected,
                !free &&
                  styles.disabled,
              ]}
              onPress={() => setTime(slot)}
            >
              <Text>{slot}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      <Text style={styles.heading}>
        Available Tables
      </Text>

      <View style={styles.wrap}>
        {availableTables.length === 0 ? (
          <Text>
            Select date, time and guests first.
          </Text>
        ) : (
          availableTables.map((table) => (
            <TouchableOpacity
              key={table.id}
              style={[
                styles.table,
                selectedTable?.id === table.id &&
                  styles.selected,
              ]}
              onPress={() =>
                setSelectedTable(table)
              }
            >
              <Text>
                Table {table.tableNumber}
              </Text>

              <Text>
                Seats: {table.capacity}
              </Text>
            </TouchableOpacity>
          ))
        )}
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleCreate}
      >
        <Text style={styles.buttonText}>
          Confirm Reservation
        </Text>
      </TouchableOpacity>

      <Text style={styles.heading}>
        My Reservations
      </Text>

      {reservations.map((reservation) => (
        <View
          key={reservation.id}
          style={styles.reservation}
        >
          <Text>
            Table: {reservation.tableId}
          </Text>

          <Text>
            {reservation.date} at{" "}
            {reservation.time}
          </Text>

          <Text>
            Status: {reservation.status}
          </Text>

          {reservation.status !==
            "Cancelled" && (
            <TouchableOpacity
              onPress={() =>
                Alert.alert(
                  "Cancel Reservation",
                  "Are you sure?",
                  [
                    { text: "No" },
                    {
                      text: "Yes",
                      onPress: () =>
                        cancelReservation(
                          reservation.id
                        ),
                    },
                  ]
                )
              }
            >
              <Text style={styles.cancel}>
                Cancel
              </Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 12,
    backgroundColor: "#fff",
  },

  heading: {
    fontSize: 19,
    fontWeight: "bold",
    marginVertical: 12,
  },

  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },

  slot: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  table: {
    padding: 12,
    backgroundColor: "#eee",
    borderRadius: 8,
  },

  selected: {
    backgroundColor: "#aaa",
  },

  disabled: {
    opacity: 0.4,
  },

  button: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  reservation: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },

  cancel: {
    color: "red",
    marginTop: 8,
  },
});