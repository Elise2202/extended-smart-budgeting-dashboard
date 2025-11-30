import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { getBudgets, updateBudget } from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../auth/AuthContext";

function BudgetsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const { data: budgets, loading, error, setData } = useApi(
    () => (username ? getBudgets(username) : Promise.resolve([])),
    [username]
  );

  const [editing, setEditing] = useState(null);
  const [newLimit, setNewLimit] = useState("");

  const startEdit = (b) => {
    setEditing(b.id);
    setNewLimit(b.limit);
  };

  const saveEdit = async (b) => {
    const payload = { ...b, limit: parseFloat(newLimit) };
    await updateBudget(b.id, payload);
    const updated = budgets.map((x) => (x.id === b.id ? payload : x));
    setData(updated);
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
                    {b.spent.toLocaleString(undefined, {
                      style: "currency",
                      currency: "USD",
                    })}
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
                      b.limit.toLocaleString(undefined, {
                        style: "currency",
                        currency: "USD",
                      })
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
