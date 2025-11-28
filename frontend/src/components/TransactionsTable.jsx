import React, { useState } from "react";

function TransactionsTable({ transactions = [], onCreate }) {
  const [form, setForm] = useState({
    date: "",
    description: "",
    category: "",
    amount: ""
  });

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.date || !form.description || !form.category || !form.amount) return;

    const payload = {
      ...form,
      amount: parseFloat(form.amount)
    };

    onCreate?.(payload);
    setForm({
      date: "",
      description: "",
      category: "",
      amount: ""
    });
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
                <td className={"align-right " + (t.amount < 0 ? "negative" : "positive")}>
                  {t.amount.toLocaleString(undefined, {
                    style: "currency",
                    currency: "USD"
                  })}
                </td>
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
