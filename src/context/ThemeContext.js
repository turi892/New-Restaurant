import React, { createContext, useState } from "react";

export const ThemeContext = createContext();

export const lightTheme = {
  background: "#f5f5f5",
  card: "#ffffff",
  text: "#222222",
  secondary: "#666666",
  border: "#dddddd",
  primary: "#222222",
  buttonText: "#ffffff",
};

export const darkTheme = {
  background: "#121212",
  card: "#1e1e1e",
  text: "#ffffff",
  secondary: "#bbbbbb",
  border: "#444444",
  primary: "#ffffff",
  buttonText: "#000000",
};

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => {
    setIsDark((value) => !value);
  };

  const theme = isDark ? darkTheme : lightTheme;

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}