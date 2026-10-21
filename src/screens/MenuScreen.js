import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";

import menu from "../data/menu";
import MenuItemCard from "../components/MenuItemCard";
import { useCart } from "../context/CartContext";
import useDebounce from "../hooks/useDebounce";
import useTheme from "../hooks/useTheme";

export default function MenuScreen({ navigation }) {
  const { dispatch, itemCount } = useCart();
  const { theme } = useTheme();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [searchText, setSearchText] = useState("");
  const [sortOrder, setSortOrder] = useState("default");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [favourites, setFavourites] = useState([]);

  const searchRef = useRef(null);
  const listRef = useRef(null);
  const renderCount = useRef(0);

  const [showTopButton, setShowTopButton] =
    useState(false);

  const debouncedSearch = useDebounce(
    searchText,
    400
  );

  renderCount.current += 1;

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    setError("");

    const timer = setTimeout(() => {
      if (mounted) {
        setMenuItems(menu);
        setLoading(false);
      }
    }, 1500);

    return () => {
      mounted = false;
      clearTimeout(timer);
    };
  }, []);

  const categories = [
    "All",
    "Starters",
    "Mains",
    "Desserts",
    "Drinks",
  ];

  const filteredItems = useMemo(() => {
    let result = [...menuItems];

    if (selectedCategory !== "All") {
      result = result.filter(
        (item) =>
          item.category === selectedCategory
      );
    }

    if (debouncedSearch.trim()) {
      result = result.filter((item) =>
        item.name
          .toLowerCase()
          .includes(
            debouncedSearch.toLowerCase()
          )
      );
    }

    if (sortOrder === "low") {
      result.sort((a, b) => a.price - b.price);
    }

    if (sortOrder === "high") {
      result.sort((a, b) => b.price - a.price);
    }

    if (sortOrder === "name") {
      result.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    }

    return result;
  }, [
    menuItems,
    selectedCategory,
    debouncedSearch,
    sortOrder,
  ]);

  useEffect(() => {
    navigation.setOptions({
      title: `Menu (${filteredItems.length})`,
    });
  }, [navigation, filteredItems.length]);

  const addToCart = React.useCallback(
    (item) => {
      dispatch({
        type: "ADD_ITEM",
        payload: item,
      });

      Alert.alert(
        "Added",
        `${item.name} added to cart.`
      );
    },
    [dispatch]
  );

  const toggleFavourite = React.useCallback(
    (id) => {
      setFavourites((current) =>
        current.includes(id)
          ? current.filter((itemId) => itemId !== id)
          : [...current, id]
      );
    },
    []
  );

  const renderItem = React.useCallback(
    ({ item }) => (
      <MenuItemCard
        item={item}
        onAddToCart={addToCart}
        isFavourite={favourites.includes(item.id)}
        onToggleFavourite={toggleFavourite}
      />
    ),
    [addToCart, favourites, toggleFavourite]
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>
          Loading menu...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text>{error}</Text>

        <TouchableOpacity
          style={styles.retry}
          onPress={() => setError("")}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </TouchableOpacity>
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
      <View style={styles.topRow}>
        <Text
          style={[
            styles.heading,
            { color: theme.text },
          ]}
        >
          Our Menu 🍽️
        </Text>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate("Cart")}
        >
          <Text style={styles.cartText}>
            🛒 {itemCount}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchRow}>
        <TextInput
          ref={searchRef}
          style={styles.search}
          placeholder="Search food..."
          value={searchText}
          onChangeText={setSearchText}
        />

        <TouchableOpacity
          style={styles.clearButton}
          onPress={() => {
            setSearchText("");
            searchRef.current?.focus();
          }}
        >
          <Text>✕</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.debug}>
        Render count: {renderCount.current}
      </Text>

      <FlatList
        horizontal
        data={categories}
        keyExtractor={(item) => item}
        showsHorizontalScrollIndicator={false}
        style={styles.categories}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.chip,
              selectedCategory === item &&
                styles.selectedChip,
            ]}
            onPress={() =>
              setSelectedCategory(item)
            }
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.sortRow}>
        <TouchableOpacity
          onPress={() => setSortOrder("low")}
        >
          <Text>Price </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortOrder("high")}
        >
          <Text>Price </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setSortOrder("name")}
        >
          <Text>Name A-Z</Text>
        </TouchableOpacity>
      </View>

      {filteredItems.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.empty}>
            No food items found 😔
          </Text>
        </View>
      ) : (
        <FlatList
          ref={listRef}
          data={filteredItems}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          onScroll={(event) => {
            setShowTopButton(
              event.nativeEvent.contentOffset.y > 300
            );
          }}
          scrollEventThrottle={16}
        />
      )}

      {showTopButton && (
        <TouchableOpacity
          style={styles.topButton}
          onPress={() =>
            listRef.current?.scrollToOffset({
              offset: 0,
              animated: true,
            })
          }
        >
          <Text style={styles.topText}>
            ↑ Top
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },

  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  heading: {
    fontSize: 27,
    fontWeight: "bold",
  },

  cartButton: {
    backgroundColor: "#222",
    padding: 10,
    borderRadius: 8,
  },

  cartText: {
    color: "#fff",
    fontWeight: "bold",
  },

  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
  },

  search: {
    flex: 1,
    height: 48,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
  },

  clearButton: {
    marginLeft: 8,
    backgroundColor: "#ddd",
    padding: 14,
    borderRadius: 8,
  },

  debug: {
    fontSize: 11,
    color: "#888",
    marginTop: 5,
  },

  categories: {
    marginVertical: 12,
  },

  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    backgroundColor: "#ddd",
    borderRadius: 20,
    marginRight: 8,
  },

  selectedChip: {
    backgroundColor: "#aaa",
  },

  sortRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 12,
  },

  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  loadingText: {
    marginTop: 10,
  },

  retry: {
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 8,
    marginTop: 15,
  },

  retryText: {
    color: "#fff",
  },

  empty: {
    fontSize: 18,
  },

  topButton: {
    position: "absolute",
    right: 20,
    bottom: 20,
    backgroundColor: "#222",
    padding: 12,
    borderRadius: 25,
  },

  topText: {
    color: "#fff",
  },
});