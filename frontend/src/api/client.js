import axios from "axios";

const api = axios.create({
  baseURL: "/api"
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
 * MOCK LOGIN
 * For now we check against hardcoded users instead of calling the backend.
 */
const MOCK_USERS = [
  {
    id: 1,
    username: "admin",
    password: "admin123",
    roles: ["ADMIN"]
  },
  {
    id: 2,
    username: "user",
    password: "user123",
    roles: ["USER"]
  }
];

export const loginRequest = async ({ username, password }) => {
  // simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 400));

  const match = MOCK_USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!match) {
    const error = new Error("Invalid username or password");
    // Shape it like an Axios error so LoginPage error handling still works
    error.response = { data: { message: "Invalid username or password" } };
    throw error;
  }

  return {
    token: `mock-token-${match.username}`,
    user: {
      id: match.id,
      username: match.username,
      roles: match.roles
    }
  };
};

// keep your other real API calls as-is
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
