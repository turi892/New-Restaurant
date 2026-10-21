import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

function MenuItemCard({
  item,
  onAddToCart,
  isFavourite,
  onToggleFavourite,
}) {
  console.log("MenuItemCard rendered:", item.name);

  return (
    <View
      style={[
        styles.card,
        !item.isAvailable && styles.unavailable,
      ]}
    >
      <Image
        source={{ uri: item.image }}
        style={styles.image}
      />

      {item.isSpecial && (
        <View style={styles.specialBadge}>
          <Text style={styles.specialText}>
            Daily Special
          </Text>
        </View>
      )}

      <TouchableOpacity
        style={styles.heart}
        onPress={() => onToggleFavourite(item.id)}
      >
        <Text style={styles.heartText}>
          {isFavourite ? "❤️" : "🤍"}
        </Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.name}>{item.name}</Text>

        <Text style={styles.description}>
          {item.description}
        </Text>

        <Text style={styles.category}>
          {item.category}
        </Text>

        <Text style={styles.price}>
          Rs. {item.price}
        </Text>

        <TouchableOpacity
          style={[
            styles.button,
            !item.isAvailable && styles.disabledButton,
          ]}
          disabled={!item.isAvailable}
          onPress={() => onAddToCart(item)}
        >
          <Text style={styles.buttonText}>
            {item.isAvailable
              ? "Add to Cart"
              : "Unavailable"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default React.memo(MenuItemCard);

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    elevation: 3,
  },

  unavailable: {
    opacity: 0.5,
  },

  image: {
    width: "100%",
    height: 180,
  },

  content: {
    padding: 15,
  },

  name: {
    fontSize: 20,
    fontWeight: "bold",
  },

  description: {
    color: "#666",
    marginTop: 5,
  },

  category: {
    color: "#888",
    marginTop: 7,
  },

  price: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 7,
  },

  button: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },

  disabledButton: {
    backgroundColor: "#888",
  },

  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },

  specialBadge: {
    position: "absolute",
    top: 10,
    left: 10,
    backgroundColor: "#fff",
    padding: 6,
    borderRadius: 6,
  },

  specialText: {
    fontWeight: "bold",
  },

  heart: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#fff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  heartText: {
    fontSize: 20,
  },
});