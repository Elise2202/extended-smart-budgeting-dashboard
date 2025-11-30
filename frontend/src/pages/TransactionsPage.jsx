import React, { useState } from "react";
import useApi from "../hooks/useApi";
import { getTransactions, createTransaction } from "../api/client";
import TransactionsTable from "../components/TransactionsTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../auth/AuthContext";

function TransactionsPage() {
  const { user } = useAuth();
  const username = user?.username;

  const [filters, setFilters] = useState({
    from: "",
    to: "",
    category: "",
  });

  const { data, loading, error, setData } = useApi(
    () =>
      username
        ? getTransactions({ username, category: filters.category || undefined })
        : Promise.resolve([]),
    [username, filters.category]
  );

  const handleChange = (e) => {
    setFilters((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleCreateTransaction = async (payload) => {
    if (!username) return;
    await createTransaction({ ...payload, username });
    setData(
      await getTransactions({
        username,
        category: filters.category || undefined,
      })
    );
  };

  return (
    <>
      <h1>Transactions</h1>

      <div className="filters">
        <input
          type="date"
          name="from"
          value={filters.from}
          onChange={handleChange}
        />
        <input
          type="date"
          name="to"
          value={filters.to}
          onChange={handleChange}
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={filters.category}
          onChange={handleChange}
        />
      </div>

      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && (
        <TransactionsTable
          transactions={data || []}
          onCreate={handleCreateTransaction}
        />
      )}
    </>
  );
}

export default TransactionsPage;
