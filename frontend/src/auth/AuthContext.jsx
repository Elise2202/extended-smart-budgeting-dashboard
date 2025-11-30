import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { loginRequest, setAuthToken } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore auth state on page reload
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem("authToken");
      const storedUser = localStorage.getItem("authUser");

      if (storedToken) {
        setToken(storedToken);
        setAuthToken(storedToken);
      }
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (e) {
      console.error("Error restoring auth state", e);
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (credentials) => {
    const data = await loginRequest(credentials);
    const { token: newToken, user: newUser } = data;

    setToken(newToken);
    setUser(newUser);
    setAuthToken(newToken);

    localStorage.setItem("authToken", newToken);
    localStorage.setItem("authUser", JSON.stringify(newUser));

    return data;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setAuthToken(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("authUser");
  };

  const value = {
    user,
    token,
    loading,
    isAuthenticated: !!token,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
