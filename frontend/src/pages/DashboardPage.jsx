import React from "react";
import useApi from "../hooks/useApi";
import { getOverview, getBudgets, getTransactions } from "../api/client";
import DashboardSummary from "../components/DashboardSummary";
import BudgetProgress from "../components/BudgetProgress";
import TransactionsTable from "../components/TransactionsTable";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { createTransaction } from "../api/client";

function DashboardPage() {
  const overviewState = useApi(getOverview, []);
  const budgetsState = useApi(getBudgets, []);
  const transactionsState = useApi(() => getTransactions({ limit: 8 }), []);

  const handleCreateTransaction = async (payload) => {
    try {
      await createTransaction(payload);
      // simple refresh
      transactionsState.setData(await getTransactions({ limit: 8 }));
    } catch (err) {
      console.error(err);
    }
  };

  const loading =
    overviewState.loading || budgetsState.loading || transactionsState.loading;
  const error = overviewState.error || budgetsState.error || transactionsState.error;

  return (
    <>
      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && !error && (
        <>
          <DashboardSummary overview={overviewState.data} />
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
