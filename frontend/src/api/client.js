// frontend/src/api/client.js
import axios from "axios";

const api = axios.create({
  // Spring Boot backend base URL
  baseURL: "http://localhost:8080/api",
});

/* ---------- AUTH TOKEN HANDLING ---------- */

// Restore token on page load (if it exists)
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

/* ---------- AUTH / LOGIN ---------- */
/**
 * POST /api/auth/login
 * Body: { username, password }
 * Response: { token }
 */
export const loginRequest = async ({ username, password }) => {
  const res = await api.post("/auth/login", { username, password });
  const { token } = res.data;

  // Minimal user object for the frontend
  const user = { username };

  return { token, user };
};

/* ---------- DASHBOARD API ---------- */

// GET /api/dashboard/summary?username=xxx
export const getDashboardSummary = async (username) => {
  const res = await api.get("/dashboard/summary", {
    params: { username },
  });
  return res.data;
};

// GET /api/dashboard/monthly?username=xxx
export const getDashboardMonthly = async (username) => {
  const res = await api.get("/dashboard/monthly", {
    params: { username },
  });
  return res.data;
};

// GET /api/dashboard/goals-progress?username=xxx
export const getDashboardGoalsProgress = async (username) => {
  const res = await api.get("/dashboard/goals-progress", {
    params: { username },
  });
  return res.data;
};

/* ---------- TRANSACTIONS API ---------- */
/**
 * Backend:
 *  GET  /api/transactions/{username}
 *  GET  /api/transactions/{username}/category/{category}
 *  POST /api/transactions/create
 */

export const getTransactions = async ({ username, category } = {}) => {
  if (!username) return [];

  let url = `/transactions/${encodeURIComponent(username)}`;
  if (category) {
    url += `/category/${encodeURIComponent(category)}`;
  }

  const res = await api.get(url);
  return res.data;
};

export const createTransaction = async (transaction) => {
  const res = await api.post("/transactions/create", transaction);
  return res.data;
};

/* ---------- BUDGETS API ---------- */
/**
 * Backend:
 *  GET  /api/budgets/{username}
 *  PUT  /api/budgets/{id}
 */

export const getBudgets = async (username) => {
  if (!username) return [];
  const res = await api.get(`/budgets/${encodeURIComponent(username)}`);
  return res.data;
};

export const updateBudget = async (budgetId, payload) => {
  const res = await api.put(`/budgets/${budgetId}`, payload);
  return res.data;
};

/* ---------- GOALS API ---------- */
/**
 * Backend:
 *  GET    /api/goals/{username}
 *  POST   /api/goals
 *  PUT    /api/goals/{id}
 *  DELETE /api/goals/{id}
 */

export const getGoals = async (username) => {
  if (!username) return [];
  const res = await api.get(`/goals/${encodeURIComponent(username)}`);
  return res.data;
};

export const createGoal = async (goal) => {
  const res = await api.post("/goals", goal);
  return res.data;
};

export const updateGoal = async (id, updated) => {
  const res = await api.put(`/goals/${id}`, updated);
  return res.data;
};

export const deleteGoal = async (id) => {
  await api.delete(`/goals/${id}`);
};

/* ---------- NOTIFICATIONS API ---------- */
/**
 * Backend:
 *  GET  /api/notifications/{username}
 *  POST /api/notifications/test?username=xxx
 */

export const getNotifications = async (username) => {
  if (!username) return [];
  const res = await api.get(`/notifications/${encodeURIComponent(username)}`);
  return res.data;
};

export const sendTestNotification = async (username) => {
  const res = await api.post("/notifications/test", null, {
    params: { username },
  });
  return res.data;
};

/* ---------- REPORTS API ---------- */
/**
 * Backend:
 *  GET /api/reports/monthly?username=&year=&month=
 *  GET /api/reports/categories?username=&year=&month=
 */

export const getMonthlyReport = async (username, year, month) => {
  const res = await api.get("/reports/monthly", {
    params: { username, year, month },
  });
  return res.data;
};

export const getCategoryReport = async (username, year, month) => {
  const res = await api.get("/reports/categories", {
    params: { username, year, month },
  });
  return res.data;
};

/* ---------- SETTINGS API ---------- */
/**
 * Backend (new):
 *  GET /api/settings?username=xxx
 *  PUT /api/settings?username=xxx
 */

export const getSettings = async (username) => {
  if (!username) return null;
  const res = await api.get("/settings", {
    params: { username },
  });
  return res.data;
};

export const updateSettings = async (username, payload) => {
  const res = await api.put("/settings", payload, {
    params: { username },
  });
  return res.data;
};

export default api;
