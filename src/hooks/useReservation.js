import { useMemo, useState } from "react";

import tables from "../data/tables";

export default function useReservation(
  reservations,
  setReservations
) {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [partySize, setPartySize] =
    useState("");
  const [selectedTable, setSelectedTable] =
    useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const timeSlots = [
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
  ];

  const availableTables = useMemo(() => {
    const guests = Number(partySize);

    if (!guests || !time || !date) {
      return [];
    }

    return tables.filter((table) => {
      if (!table.available) return false;

      if (table.capacity < guests) {
        return false;
      }

      const alreadyBooked = reservations.some(
        (reservation) =>
          reservation.date === date &&
          reservation.time === time &&
          reservation.tableId === table.id &&
          reservation.status !== "Cancelled"
      );

      return !alreadyBooked;
    });
  }, [date, time, partySize, reservations]);

  const createReservation = () => {
    const guests = Number(partySize);

    if (!name.trim()) {
      return {
        success: false,
        message: "Enter your name.",
      };
    }

    if (!date || !time) {
      return {
        success: false,
        message: "Select date and time.",
      };
    }

    if (guests < 1 || guests > 12) {
      return {
        success: false,
        message: "Party size must be between 1 and 12.",
      };
    }

    if (!/^03\d{2}-\d{7}$/.test(phone)) {
      return {
        success: false,
        message:
          "Phone must be like 0300-1234567.",
      };
    }

    if (!selectedTable) {
      return {
        success: false,
        message: "Please select a table.",
      };
    }

    const reservation = {
      id: Date.now().toString(),
      customerName: name,
      phone,
      date,
      time,
      guests,
      tableId: selectedTable.id,
      status: "Pending",
    };

    setReservations((current) => [
      ...current,
      reservation,
    ]);

    return {
      success: true,
      reservation,
    };
  };

  const cancelReservation = (id) => {
    setReservations((current) =>
      current.map((reservation) =>
        reservation.id === id
          ? {
              ...reservation,
              status: "Cancelled",
            }
          : reservation
      )
    );
  };

  return {
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
  };
}