// BudgetsPage.jsx
import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { getBudgets, updateBudget } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../auth/AuthContext";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../utils/format";

function BudgetsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const { settings } = useSettings();
  const currency = settings?.currency || "USD";
  const locale = settings?.locale || undefined;

  const { data: budgets, loading, error, setData } = useApi(
    () => (username ? getBudgets(username) : Promise.resolve([])),
    [username]
  );

  const [editing, setEditing] = useState(null);
  const [newLimit, setNewLimit] = useState("");

  const startEdit = (b) => {
    setEditing(b.id);
    setNewLimit(b.limit); // b.limit is from our mapping
  };

  const saveEdit = async (b) => {
    const updatedBudget = await updateBudget(b.id, {
      ...b,
      limit: parseFloat(newLimit),
    });

    const updatedList = budgets.map((x) =>
      x.id === b.id ? updatedBudget : x
    );
    setData(updatedList);
    setEditing(null);
  };

  return (
    <>
      <h1>Budgets</h1>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && budgets && (
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Category</th>
                <th className="align-right">Spent</th>
                <th className="align-right">Limit</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {budgets.map((b) => (
                <tr key={b.id || b.category}>
                  <td>{b.category}</td>
                  <td className="align-right">
                    {formatCurrency(b.spent, currency, locale)}
                  </td>
                  <td className="align-right">
                    {editing === b.id ? (
                      <input
                        type="number"
                        step="0.01"
                        value={newLimit}
                        onChange={(e) => setNewLimit(e.target.value)}
                      />
                    ) : (
                      formatCurrency(b.limit, currency, locale)
                    )}
                  </td>
                  <td>
                    {editing === b.id ? (
                      <>
                        <button onClick={() => saveEdit(b)}>Save</button>
                        <button onClick={() => setEditing(null)}>Cancel</button>
                      </>
                    ) : (
                      <button onClick={() => startEdit(b)}>Edit</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}

export default BudgetsPage;
