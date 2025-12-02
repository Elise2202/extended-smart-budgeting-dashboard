import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { useAuth } from "../auth/AuthContext";
import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from "../api/client";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../utils/format";

function GoalsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const { settings } = useSettings();
  const currency = settings?.currency || "USD";
  const locale = settings?.locale || undefined;

  // Load goals for this user
  const {
    data: goals = [],
    loading,
    error,
    setData,
  } = useApi(
    () => (username ? getGoals(username) : Promise.resolve([])),
    [username]
  );

  // New goal form
  const [newGoal, setNewGoal] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
  });

  // Edit state
  const [editingId, setEditingId] = useState(null);
  const [editValues, setEditValues] = useState({
    title: "",
    targetAmount: "",
    savedAmount: "",
  });

  // ----- Create -----
  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewGoal((prev) => ({ ...prev, [name]: value }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!username) return;
    if (!newGoal.title || !newGoal.targetAmount) return;

    const payload = {
      username,
      title: newGoal.title,
      targetAmount: parseFloat(newGoal.targetAmount),
      savedAmount: newGoal.savedAmount
        ? parseFloat(newGoal.savedAmount)
        : 0,
    };

    const created = await createGoal(payload);
    setData([...(goals || []), created]);

    setNewGoal({
      title: "",
      targetAmount: "",
      savedAmount: "",
    });
  };

  // ----- Edit -----
  const startEdit = (g) => {
    setEditingId(g.id);
    setEditValues({
      title: g.title ?? "",
      targetAmount: g.targetAmount ?? "",
      savedAmount: g.savedAmount ?? "",
    });
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditValues((prev) => ({ ...prev, [name]: value }));
  };

  const saveEdit = async (goal) => {
    const targetAmount = parseFloat(editValues.targetAmount);
    const savedAmount = parseFloat(editValues.savedAmount || "0");

    const payload = {
      ...goal,
      title: editValues.title,
      targetAmount: isNaN(targetAmount) ? 0 : targetAmount,
      savedAmount: isNaN(savedAmount) ? 0 : savedAmount,
    };

    const updated = await updateGoal(goal.id, payload);
    setData((goals || []).map((g) => (g.id === goal.id ? updated : g)));
    setEditingId(null);
  };

  const cancelEdit = () => setEditingId(null);

  // ----- Delete -----
  const handleDelete = async (id) => {
    await deleteGoal(id);
    setData((goals || []).filter((g) => g.id !== id));
  };

  // ----- Render -----
  return (
    <>
      <h1>Goals</h1>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && (
        <>
          <div className="card">
            <h2>Your Savings Goals</h2>

            {(!goals || goals.length === 0) ? (
              <p className="muted">You don&apos;t have any goals yet.</p>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th className="align-right">Progress</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {goals.map((g) => {
                    const target = Number(g.targetAmount || 0);
                    const saved = Number(g.savedAmount || 0);
                    const ratio =
                      target > 0 ? Math.min(100, (saved / target) * 100) : 0;
                    const isEditing = editingId === g.id;

                    return (
                      <tr key={g.id}>
                        <td>
                          {isEditing ? (
                            <input
                              type="text"
                              name="title"
                              value={editValues.title}
                              onChange={handleEditChange}
                            />
                          ) : (
                            g.title
                          )}
                        </td>
                        <td className="align-right">
                          {isEditing ? (
                            <>
                              <input
                                type="number"
                                name="savedAmount"
                                step="0.01"
                                value={editValues.savedAmount}
                                onChange={handleEditChange}
                                style={{ width: "6rem", marginRight: "0.5rem" }}
                              />
                              /
                              <input
                                type="number"
                                name="targetAmount"
                                step="0.01"
                                value={editValues.targetAmount}
                                onChange={handleEditChange}
                                style={{ width: "6rem", marginLeft: "0.5rem" }}
                              />
                            </>
                          ) : (
                            <>
                              {formatCurrency(saved, currency, locale)}{" "}
                              /{" "}
                              {formatCurrency(target, currency, locale)}
                              <div className="progress-bar" style={{ marginTop: 4 }}>
                                <div
                                  className={
                                    "progress-bar-inner " +
                                    (ratio >= 100 ? "progress-over" : "")
                                  }
                                  style={{ width: `${ratio}%` }}
                                />
                              </div>
                            </>
                          )}
                        </td>
                        <td>
                          {isEditing ? (
                            <>
                              <button onClick={() => saveEdit(g)}>Save</button>
                              <button onClick={cancelEdit}>Cancel</button>
                            </>
                          ) : (
                            <>
                              <button onClick={() => startEdit(g)}>Edit</button>
                              <button
                                onClick={() => handleDelete(g.id)}
                                style={{ marginLeft: "0.5rem" }}
                              >
                                Delete
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>

          <div className="card" style={{ marginTop: "1.5rem" }}>
            <h2>Add New Goal</h2>
            <form className="inline-form" onSubmit={handleCreate}>
              <input
                type="text"
                name="title"
                placeholder="Goal title"
                value={newGoal.title}
                onChange={handleNewChange}
                required
              />
              <input
                type="number"
                name="targetAmount"
                placeholder="Target amount"
                step="0.01"
                value={newGoal.targetAmount}
                onChange={handleNewChange}
                required
              />
              <input
                type="number"
                name="savedAmount"
                placeholder="Already saved"
                step="0.01"
                value={newGoal.savedAmount}
                onChange={handleNewChange}
              />
              <button type="submit">Add Goal</button>
            </form>
          </div>
        </>
      )}
    </>
  );
}

export default GoalsPage;
