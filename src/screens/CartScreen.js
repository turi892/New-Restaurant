import React from "react";

import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
} from "react-native";

import { useCart } from "../context/CartContext";
import useTheme from "../hooks/useTheme";

export default function CartScreen({ navigation }) {
  const { state, dispatch } = useCart();
  const { theme } = useTheme();

  const subtotal = state.items.reduce(
    (total, item) =>
      total + item.price * item.quantity,
    0
  );

  const discount =
    subtotal * (state.discountPercent / 100);

  const total = subtotal - discount;

  if (state.items.length === 0) {
    return (
      <View
        style={[
          styles.empty,
          { backgroundColor: theme.background },
        ]}
      >
        <Text style={styles.icon}>🛒</Text>
        <Text
          style={[
            styles.emptyTitle,
            { color: theme.text },
          ]}
        >
          Cart is Empty
        </Text>
        <Text style={{ color: theme.secondary }}>
          Add food items from the menu.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <FlatList
        data={state.items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              { backgroundColor: theme.card },
            ]}
          >
            <Text
              style={[
                styles.name,
                { color: theme.text },
              ]}
            >
              {item.name}
            </Text>

            <Text style={{ color: theme.secondary }}>
              Rs. {item.price}
            </Text>

            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.smallButton}
                onPress={() =>
                  dispatch({
                    type: "DECREMENT",
                    payload: item.id,
                  })
                }
              >
                <Text style={styles.white}>
                  −
                </Text>
              </TouchableOpacity>

              <Text
                style={[
                  styles.quantity,
                  { color: theme.text },
                ]}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                style={styles.smallButton}
                onPress={() =>
                  dispatch({
                    type: "INCREMENT",
                    payload: item.id,
                  })
                }
              >
                <Text style={styles.white}>
                  +
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  dispatch({
                    type: "REMOVE_ITEM",
                    payload: item.id,
                  })
                }
              >
                <Text style={styles.remove}>
                  Remove
                </Text>
              </TouchableOpacity>
            </View>

            <TextInput
              style={styles.note}
              placeholder="Special instructions e.g. no onions"
              value={item.note}
              onChangeText={(text) =>
                dispatch({
                  type: "UPDATE_NOTE",
                  payload: {
                    id: item.id,
                    note: text,
                  },
                })
              }
            />
          </View>
        )}
      />

      <TextInput
        style={styles.promo}
        placeholder="Promo code: WELCOME10"
        onSubmitEditing={(event) =>
          dispatch({
            type: "APPLY_PROMO",
            payload: event.nativeEvent.text,
          })
        }
      />

      {state.promoError ? (
        <Text style={styles.error}>
          {state.promoError}
        </Text>
      ) : null}

      {state.promoCode ? (
        <TouchableOpacity
          onPress={() =>
            dispatch({ type: "REMOVE_PROMO" })
          }
        >
          <Text style={styles.removePromo}>
            Remove {state.promoCode} promo
          </Text>
        </TouchableOpacity>
      ) : null}

      <View
        style={[
          styles.totalBox,
          { backgroundColor: theme.card },
        ]}
      >
        <Text style={{ color: theme.text }}>
          Subtotal: Rs. {subtotal.toFixed(0)}
        </Text>

        <Text style={{ color: theme.text }}>
          Discount: Rs. {discount.toFixed(0)}
        </Text>

        <Text
          style={[
            styles.total,
            { color: theme.text },
          ]}
        >
          Total: Rs. {total.toFixed(0)}
        </Text>

        <TouchableOpacity
          style={styles.checkout}
          onPress={() =>
            navigation.navigate("OrderSummary")
          }
        >
          <Text style={styles.white}>
            Proceed to Checkout
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  card: {
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
  },

  name: {
    fontSize: 19,
    fontWeight: "bold",
  },

  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },

  smallButton: {
    width: 35,
    height: 35,
    backgroundColor: "#222",
    borderRadius: 7,
    justifyContent: "center",
    alignItems: "center",
  },

  white: {
    color: "#fff",
    fontWeight: "bold",
  },

  quantity: {
    fontSize: 18,
    marginHorizontal: 15,
  },

  remove: {
    color: "red",
    marginLeft: 15,
  },

  note: {
    marginTop: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
  },

  promo: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },

  error: {
    color: "red",
  },

  removePromo: {
    color: "red",
    marginVertical: 5,
  },

  totalBox: {
    padding: 15,
    borderRadius: 12,
  },

  total: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 8,
  },

  checkout: {
    backgroundColor: "#222",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },

  empty: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  icon: {
    fontSize: 60,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
});