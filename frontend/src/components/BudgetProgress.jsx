import React from "react";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../utils/format";

function BudgetProgress({ budgets = [] }) {
  const { settings } = useSettings();
  const currency = settings?.currency || "USD";
  const locale = settings?.locale || undefined;

  return (
    <div className="card">
      <h2>Budgets</h2>
      {budgets.length === 0 ? (
        <p className="muted">No budgets defined yet.</p>
      ) : (
        <ul className="budget-list">
          {budgets.map((b) => {
            const ratio = b.limit > 0 ? (b.spent / b.limit) * 100 : 0;
            const percent = Math.min(100, ratio);

            return (
              <li key={b.id || b.category} className="budget-item">
                <div className="budget-header">
                  <span>{b.category}</span>
                  <span>
                    {formatCurrency(b.spent, currency, locale)}{" "}
                    / {formatCurrency(b.limit, currency, locale)}
                  </span>
                </div>
                <div className="progress-bar">
                  <div
                    className={
                      "progress-bar-inner " +
                      (percent >= 100 ? "progress-over" : "")
                    }
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

export default BudgetProgress;
