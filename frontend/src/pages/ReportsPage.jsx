import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { useAuth } from "../auth/AuthContext";
import {
  getMonthlyReport,
  getCategoryReport,
} from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../utils/format";

const monthOptions = [
  { value: 1, label: "January" },
  { value: 2, label: "February" },
  { value: 3, label: "March" },
  { value: 4, label: "April" },
  { value: 5, label: "May" },
  { value: 6, label: "June" },
  { value: 7, label: "July" },
  { value: 8, label: "August" },
  { value: 9, label: "September" },
  { value: 10, label: "October" },
  { value: 11, label: "November" },
  { value: 12, label: "December" },
];

function ReportsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const { settings } = useSettings();
  const currency = settings?.currency || "USD";
  const locale = settings?.locale || undefined;

  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  // Monthly report
  const monthlyState = useApi(
    () =>
      username ? getMonthlyReport(username, year, month) : Promise.resolve(null),
    [username, year, month]
  );

  // Category report
  const categoryState = useApi(
    () =>
      username ? getCategoryReport(username, year, month) : Promise.resolve([]),
    [username, year, month]
  );

  const loading = monthlyState.loading || categoryState.loading;
  const error = monthlyState.error || categoryState.error;

  // categories could be array or object; normalize to array
  const categoriesArray = Array.isArray(categoryState.data)
    ? categoryState.data
    : categoryState.data
    ? Object.entries(categoryState.data).map(([name, total]) => ({
        name,
        total,
      }))
    : [];

  const monthly = monthlyState.data || {};

  return (
    <>
      <h1>Reports</h1>

      {/* Filters */}
      <div className="filters">
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value, 10) || year)}
          style={{ width: "100px" }}
        />
        <select
          value={month}
          onChange={(e) => setMonth(parseInt(e.target.value, 10))}
        >
          {monthOptions.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && !error && (
        <div className="grid-2">
          {/* Monthly summary card */}
          <div className="card">
            <h2>
              Monthly Summary – {monthOptions.find((m) => m.value === month)?.label}{" "}
              {year}
            </h2>

            {"totalIncome" in monthly || "totalExpenses" in monthly ? (
              <>
                <p>
                  <strong>Income: </strong>
                  {formatCurrency(monthly.totalIncome, currency, locale)}
                </p>
                <p>
                  <strong>Expenses: </strong>
                  {formatCurrency(monthly.totalExpenses, currency, locale)}
                </p>
                <p>
                  <strong>Balance: </strong>
                  {formatCurrency(monthly.balance, currency, locale)}
                </p>
              </>
            ) : (
              <pre className="muted" style={{ whiteSpace: "pre-wrap" }}>
                {/* fallback if backend returns different shape */}
                {JSON.stringify(monthly, null, 2)}
              </pre>
            )}
          </div>

          {/* Categories card */}
          <div className="card">
            <h2>Expenses by Category</h2>

            {categoriesArray.length === 0 ? (
              <p className="muted">No category data for this period.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Category</th>
                    <th className="align-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {categoriesArray.map((c) => (
                    <tr key={c.name}>
                      <td>{c.name}</td>
                      <td className="align-right">
                        {formatCurrency(c.total, currency, locale)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default ReportsPage;
