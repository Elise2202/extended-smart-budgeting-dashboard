import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { getSettings } from "../api/client";

const SettingsContext = createContext(null);

export function SettingsProvider({ children }) {
  const { user } = useAuth();
  const username = user?.username;

  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🌗 theme state is purely frontend (stored in localStorage)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("sbTheme") || "light";
  });

  // apply theme to <html data-theme="...">
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("sbTheme", theme);
  }, [theme]);

  // Load user settings from backend
  useEffect(() => {
    if (!username) {
      setSettings(null);
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getSettings(username);
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [username]);

  const refresh = async () => {
    if (!username) return;
    try {
      const data = await getSettings(username);
      setSettings(data);
    } catch (err) {
      console.error("Failed to refresh settings", err);
      setError(err);
    }
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  const value = {
    settings, // { username, currency, defaultPeriod, locale }
    loading,
    error,
    refresh,
    setSettings,
    theme,
    setTheme,
    toggleTheme,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) {
    throw new Error("useSettings must be used within SettingsProvider");
  }
  return ctx;
}
