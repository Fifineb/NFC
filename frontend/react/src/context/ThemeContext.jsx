import React, { createContext, useContext, useEffect, useState } from "react";

// 1. Création du contexte
const ThemeContext = createContext();

// 2. Provider global
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState("light"); // light | dark

  // 🔄 Charger le thème au démarrage
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      document.documentElement.setAttribute("data-theme", "light");
    }
  }, []);

  // 🌗 Toggle thème
  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";

    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const value = {
    theme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// 3. Hook personnalisé (IMPORTANT pour éviter ton erreur)
export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};