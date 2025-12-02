import React, { useState } from "react";
import { useSettings } from "../settings/SettingsContext";
import { formatCurrency } from "../utils/format";

function TransactionsTable({ transactions = [], onCreate }) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: "",
    amount: "",
    type: "expense", // default
  });

  const { settings } = useSettings();
  const currency = settings?.currency || "USD";
  const locale = settings?.locale || undefined;

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.category || !form.amount) return;

    const payload = {
      date: form.date,
      description: form.description,
      category: form.category,
      amount: parseFloat(form.amount),
      type: form.type, // <-- IMPORTANT
    };

    onCreate?.(payload);

    setForm({
      date: "",
      description: "",
      category: "",
      amount: "",
      type: "expense",
    });
  };

  const renderAmountCell = (t) => {
    // Prefer the explicit type if present
    let signedAmount;
    if (t.type === "expense") {
      signedAmount = -Math.abs(t.amount);
    } else if (t.type === "income") {
      signedAmount = Math.abs(t.amount);
    } else {
      // Fallback for old data with no type set
      signedAmount = t.amount;
    }

    const className =
      "align-right " + (signedAmount < 0 ? "negative" : "positive");

    return (
      <td className={className}>
        {formatCurrency(signedAmount, currency, locale)}
      </td>
    );
  };

  return (
    <div className="card">
      <div className="card-header-row">
        <h2>Transactions</h2>
      </div>

      <table className="table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Category</th>
            <th className="align-right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan={4} className="muted">
                No transactions found.
              </td>
            </tr>
          ) : (
            transactions.map((t) => (
              <tr key={t.id || `${t.date}-${t.description}`}>
                <td>{t.date}</td>
                <td>{t.description}</td>
                <td>{t.category}</td>
                {renderAmountCell(t)}
              </tr>
            ))
          )}
        </tbody>
      </table>

      <form className="inline-form" onSubmit={handleSubmit}>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          required
        />

        {/* NEW: type selector */}
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <input
          type="number"
          name="amount"
          placeholder="Amount"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          required
        />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default TransactionsTable;
