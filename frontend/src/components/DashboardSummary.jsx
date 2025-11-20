import React from "react";

function DashboardSummary({ overview }) {
  if (!overview) return null;

  const {
    month,
    totalIncome,
    totalExpenses,
    savings,
    savingsRate,
    topCategories = []
  } = overview;

  return (
    <div className="grid-2">
      <div className="card">
        <h2>Monthly Snapshot</h2>
        <p className="label">Month</p>
        <p className="value">{month}</p>

        <div className="summary-row">
          <div>
            <p className="label">Income</p>
            <p className="value positive">
              {totalIncome?.toLocaleString(undefined, {
                style: "currency",
                currency: "USD"
              })}
            </p>
          </div>
          <div>
            <p className="label">Expenses</p>
            <p className="value negative">
              {totalExpenses?.toLocaleString(undefined, {
                style: "currency",
                currency: "USD"
              })}
            </p>
          </div>
          <div>
            <p className="label">Savings</p>
            <p className="value">
              {savings?.toLocaleString(undefined, {
                style: "currency",
                currency: "USD"
              })}
            </p>
            <p className="subtext">{savingsRate}% of income</p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2>Top Spending Categories</h2>
        {topCategories.length === 0 ? (
          <p className="muted">No data yet.</p>
        ) : (
          <ul className="category-list">
            {topCategories.map((cat) => (
              <li key={cat.name} className="category-item">
                <span>{cat.name}</span>
                <span>
                  {cat.amount.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD"
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default DashboardSummary;
