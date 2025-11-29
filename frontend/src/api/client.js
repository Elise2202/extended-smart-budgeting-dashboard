import axios from "axios";

const api = axios.create({
  // Backend base URL (Spring Boot)
  baseURL: "http://localhost:8080/api",
});

// Restore token on load (if any)
if (typeof window !== "undefined") {
  const storedToken = localStorage.getItem("authToken");
  if (storedToken) {
    api.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
  }
}

export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
};

/**
 * REAL LOGIN
 * Calls: POST http://localhost:8080/api/auth/login
 */
export const loginRequest = async ({ username, password }) => {
  const res = await api.post("/auth/login", { username, password });

  // Backend returns a User object (id, username, ...).
  const user = res.data;

  // AuthContext expects { token, user }
  const token = `fake-token-${user.username}`;

  return {
    token,
    user,
  };
};

/* --- other API calls (adjust paths if needed) --- */

export const getOverview = async () => {
  const res = await api.get("/overview");
  return res.data;
};

export const getTransactions = async (params = {}) => {
  const res = await api.get("/transactions", { params });
  return res.data;
};

export const createTransaction = async (transaction) => {
  const res = await api.post("/transactions", transaction);
  return res.data;
};

export const getBudgets = async () => {
  const res = await api.get("/budgets");
  return res.data;
};

export const updateBudget = async (budgetId, payload) => {
  const res = await api.put(`/budgets/${budgetId}`, payload);
  return res.data;
};

export const getSettings = async () => {
  const res = await api.get("/settings");
  return res.data;
};

export const updateSettings = async (payload) => {
  const res = await api.put("/settings", payload);
  return res.data;
};

export default api;
