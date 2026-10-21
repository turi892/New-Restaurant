import React, { createContext, useState } from "react";
import users from "../data/users";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    const foundUser = users.find(
      (item) =>
        item.email.toLowerCase() === email.toLowerCase() &&
        item.password === password
    );

    if (!foundUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    setUser(foundUser);

    return {
      success: true,
      user: foundUser,
    };
  };

  const signup = (newUser) => {
    const exists = users.some(
      (item) => item.email.toLowerCase() === newUser.email.toLowerCase()
    );

    if (exists) {
      return {
        success: false,
        message: "Email already exists.",
      };
    }

    const user = {
      ...newUser,
      id: Date.now().toString(),
    };

    users.push(user);
    setUser(user);

    return {
      success: true,
      user,
    };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}