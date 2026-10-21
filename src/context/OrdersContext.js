import React, {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

import ordersReducer, {
  initialOrders,
} from "../reducers/ordersReducer";

const OrdersContext = createContext();

export function OrdersProvider({ children }) {
  const [orders, dispatch] = useReducer(
    ordersReducer,
    initialOrders
  );

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const savedOrders =
          await AsyncStorage.getItem("restaurant_orders");

        if (savedOrders) {
          const parsedOrders = JSON.parse(savedOrders);

          parsedOrders.forEach((order) => {
            dispatch({
              type: "ADD_ORDER",
              payload: order,
            });
          });
        }
      } catch (error) {
        console.log("Error loading orders:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  useEffect(() => {
    if (!loading) {
      AsyncStorage.setItem(
        "restaurant_orders",
        JSON.stringify(orders)
      );
    }
  }, [orders, loading]);

  const addOrder = (order) => {
    dispatch({
      type: "ADD_ORDER",
      payload: order,
    });
  };

  const updateStatus = (id, status) => {
    dispatch({
      type: "UPDATE_STATUS",
      payload: {
        id,
        status,
      },
    });
  };

  return (
    <OrdersContext.Provider
      value={{
        orders,
        addOrder,
        updateStatus,
        loading,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
}

export function useOrders() {
  const context = useContext(OrdersContext);

  if (!context) {
    throw new Error(
      "useOrders must be used inside OrdersProvider"
    );
  }

  return context;
}