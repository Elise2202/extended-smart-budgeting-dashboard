// frontend/src/api/client.js
import axios from "axios";

const api = axios.create({
  // Spring Boot backend base URL
  baseURL: "http://localhost:8080/api",
});

/* ---------- INTERCEPTORS ---------- */

// Clear auth if backend returns 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("authToken");
      localStorage.removeItem("authUser");
      // Optional: window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
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

/* ---------- AUTH / REGISTER ---------- */
/**
 * POST /api/auth/register
 * Body: { username, password }
 * Response: { message, username }  (depending on your backend)
 */
export const registerRequest = async ({ username, password }) => {
  const res = await api.post("/auth/register", { username, password });
  return res.data;
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
 *  POST /api/budgets       (if you add a create form later)
 */

// Convert backend ➜ frontend shape
const fromApiBudget = (b) => ({
  id: b.id,
  username: b.username,
  category: b.category,
  // fall back to 0 so UI code is simpler
  limit: b.limitAmount ?? 0,
  spent: b.spentAmount ?? 0,
});

// Convert frontend ➜ backend shape
const toApiBudget = (b) => ({
  id: b.id,
  username: b.username,
  category: b.category,
  limitAmount: b.limit,
  spentAmount: b.spent,
});

export const getBudgets = async (username) => {
  if (!username) return [];
  const res = await api.get(`/budgets/${encodeURIComponent(username)}`);
  return res.data.map(fromApiBudget);
};

export const updateBudget = async (budgetId, budget) => {
  const payload = toApiBudget({ ...budget, id: budgetId });
  const res = await api.put(`/budgets/${budgetId}`, payload);
  return fromApiBudget(res.data);
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
