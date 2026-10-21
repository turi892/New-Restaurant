import React, { useState } from "react";

import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
  ScrollView,
} from "react-native";

import useAuth from "../hooks/useAuth";
import useTheme from "../hooks/useTheme";

export default function LoginScreen({ navigation }) {
  const { login, signup } = useAuth();
  const { theme } = useTheme();

  const [mode, setMode] = useState("login");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [role, setRole] = useState("customer");
  const [showPassword, setShowPassword] =
    useState(false);

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const validate = () => {
    const newErrors = {};

    if (!email.includes("@")) {
      newErrors.email = "Enter a valid email.";
    }

    if (password.length < 8 || !/\d/.test(password)) {
      newErrors.password =
        "Password must be 8 characters and contain a digit.";
    }

    if (mode === "signup") {
      if (!name.trim()) {
        newErrors.name = "Name is required.";
      }

      if (password !== confirmPassword) {
        newErrors.confirmPassword =
          "Passwords do not match.";
      }
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      let result;

      if (mode === "login") {
        result = login(email, password);
      } else {
        result = signup({
          name,
          email,
          password,
          role,
          phone: "",
        });
      }

      setIsSubmitting(false);

      if (!result.success) {
        Alert.alert("Error", result.message);
        return;
      }

      if (result.user.role === "manager") {
        navigation.replace("Manager");
      } else {
        navigation.replace("Customer");
      }
    }, 1000);
  };

  const changeMode = () => {
    setMode((current) =>
      current === "login" ? "signup" : "login"
    );

    setErrors({});
  };

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: theme.background },
      ]}
    >
      <View
        style={[
          styles.card,
          { backgroundColor: theme.card },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: theme.text },
          ]}
        >
          🍽️ Restaurant App
        </Text>

        <Text
          style={[
            styles.subtitle,
            { color: theme.secondary },
          ]}
        >
          {mode === "login"
            ? "Welcome back"
            : "Create your account"}
        </Text>

        {mode === "signup" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Full Name"
              value={name}
              onChangeText={setName}
            />

            {errors.name && (
              <Text style={styles.error}>
                {errors.name}
              </Text>
            )}
          </>
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        {errors.email && (
          <Text style={styles.error}>
            {errors.email}
          </Text>
        )}

        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry={!showPassword}
          value={password}
          onChangeText={setPassword}
        />

        {errors.password && (
          <Text style={styles.error}>
            {errors.password}
          </Text>
        )}

        {mode === "signup" && (
          <>
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              secureTextEntry={!showPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            {errors.confirmPassword && (
              <Text style={styles.error}>
                {errors.confirmPassword}
              </Text>
            )}

            <View style={styles.roleRow}>
              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "customer" &&
                    styles.selectedRole,
                ]}
                onPress={() => setRole("customer")}
              >
                <Text>Customer</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.roleButton,
                  role === "manager" &&
                    styles.selectedRole,
                ]}
                onPress={() => setRole("manager")}
              >
                <Text>Manager</Text>
              </TouchableOpacity>
            </View>
          </>
        )}

        <TouchableOpacity
          onPress={() =>
            setShowPassword((current) => !current)
          }
        >
          <Text style={styles.showPassword}>
            {showPassword
              ? "Hide Password"
              : "Show Password"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            { backgroundColor: theme.primary },
          ]}
          disabled={isSubmitting}
          onPress={handleSubmit}
        >
          {isSubmitting ? (
            <ActivityIndicator color={theme.buttonText} />
          ) : (
            <Text
              style={[
                styles.buttonText,
                { color: theme.buttonText },
              ]}
            >
              {mode === "login" ? "Login" : "Sign Up"}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={changeMode}>
          <Text style={styles.switchText}>
            {mode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Login"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },

  card: {
    padding: 25,
    borderRadius: 15,
    elevation: 5,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
  },

  subtitle: {
    textAlign: "center",
    marginVertical: 20,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 5,
    backgroundColor: "#fff",
  },

  error: {
    color: "red",
    marginBottom: 8,
    fontSize: 12,
  },

  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
  },

  buttonText: {
    fontWeight: "bold",
    fontSize: 17,
  },

  switchText: {
    textAlign: "center",
    marginTop: 20,
    color: "#1976d2",
  },

  showPassword: {
    marginTop: 10,
    color: "#1976d2",
  },

  roleRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 10,
  },

  roleButton: {
    flex: 1,
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    alignItems: "center",
  },

  selectedRole: {
    borderColor: "#222",
    backgroundColor: "#eee",
  },
});