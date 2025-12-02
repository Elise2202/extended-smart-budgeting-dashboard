// frontend/src/components/DashboardSummary.jsx
import React from "react";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../utils/format";

function DashboardSummary({ overview }) {
  if (!overview) return null;

  const {
    month,
    totalIncome,
    totalExpenses,
    savings,
    savingsRate,
    topCategories = [],
    goalsAchieved,
  } = overview;

  const { settings } = useSettings();
  const currency = settings?.currency || "USD";
  const locale = settings?.locale || undefined;

  return (
    <div className="grid-2">
      {/* LEFT: Monthly snapshot */}
      <div className="card">
        <h2>Monthly Snapshot</h2>

        <p className="label">Month</p>
        <p className="value">{month}</p>

        <div className="summary-row">
          <div>
            <p className="label">Income</p>
            <p className="value positive">
              {formatCurrency(totalIncome, currency, locale)}
            </p>
          </div>

          <div>
            <p className="label">Expenses</p>
            <p className="value negative">
              {formatCurrency(totalExpenses, currency, locale)}
            </p>
          </div>

          <div>
            <p className="label">Savings</p>
            <p className="value">
              {formatCurrency(savings, currency, locale)}
            </p>
            <p className="subtext">{savingsRate}% of income</p>

            {typeof goalsAchieved === "number" && (
              <p className="subtext">Goals achieved: {goalsAchieved}</p>
            )}
          </div>
        </div>
      </div>

      {/* RIGHT: Top spending categories */}
      <div className="card">
        <h2>Top Spending Categories</h2>
        {topCategories.length === 0 ? (
          <p className="muted">No data yet.</p>
        ) : (
          <ul className="category-list">
            {topCategories.map((cat) => (
              <li key={cat.name} className="category-item">
                <span>{cat.name}</span>
                <span>{formatCurrency(cat.amount, currency, locale)}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardSummary;
