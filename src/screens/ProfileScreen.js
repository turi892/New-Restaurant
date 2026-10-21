import React from "react";

import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

export default function ProfileScreen({
  navigation,
}) {
  const { user, logout } = useAuth();
  const { isDark, theme, toggleTheme } =
    useTheme();

  const handleLogout = () => {
    logout();
    navigation.reset({
      index: 0,
      routes: [{ name: "Login" }],
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
        Profile
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: theme.card },
        ]}
      >
        <Text style={{ color: theme.text }}>
          Name: {user?.name}
        </Text>

        <Text style={{ color: theme.text }}>
          Email: {user?.email}
        </Text>

        <Text style={{ color: theme.text }}>
          Role: {user?.role}
        </Text>
      </View>

      <View style={styles.themeRow}>
        <Text style={{ color: theme.text }}>
          Dark Mode
        </Text>

        <Switch
          value={isDark}
          onValueChange={toggleTheme}
        />
      </View>

      <TouchableOpacity
        style={styles.logout}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
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

  card: {
    padding: 20,
    borderRadius: 12,
    gap: 10,
  },

  themeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 25,
  },

  logout: {
    backgroundColor: "red",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
  },

  logoutText: {
    color: "#fff",
    fontWeight: "bold",
  },
});