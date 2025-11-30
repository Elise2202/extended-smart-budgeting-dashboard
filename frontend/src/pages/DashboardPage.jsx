import React from "react";
import useApi from "../hooks/useApi";
import {
  getDashboardSummary,
  getBudgets,
  getTransactions,
  createTransaction,
} from "../api/client";

import DashboardSummary from "../components/DashboardSummary";
import BudgetProgress from "../components/BudgetProgress";
import TransactionsTable from "../components/TransactionsTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { useAuth } from "../auth/AuthContext";

function DashboardPage() {
  const { user } = useAuth();
  const username = user?.username;

  // If somehow no user, don't call APIs
  const summaryState = useApi(
    () => (username ? getDashboardSummary(username) : Promise.resolve(null)),
    [username]
  );

  const budgetsState = useApi(
    () => (username ? getBudgets(username) : Promise.resolve([])),
    [username]
  );

  const transactionsState = useApi(
    () => (username ? getTransactions({ username }) : Promise.resolve([])),
    [username]
  );

  const handleCreateTransaction = async (payload) => {
    if (!username) return;
    try {
      await createTransaction({ ...payload, username });
      transactionsState.setData(await getTransactions({ username }));
    } catch (err) {
      console.error(err);
    }
  };

  const loading =
    summaryState.loading || budgetsState.loading || transactionsState.loading;

  const error =
    summaryState.error || budgetsState.error || transactionsState.error;

  return (
    <>
      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && !error && (
        <>
          <DashboardSummary overview={summaryState.data} />
          <div className="grid-2">
            <BudgetProgress budgets={budgetsState.data || []} />
            <TransactionsTable
              transactions={transactionsState.data || []}
              onCreate={handleCreateTransaction}
            />
          </div>
        </>
      )}
    </>
  );
}

export default DashboardPage;
