import React from "react";
import useApi from "../hooks/useApi";
import {
  getDashboardSummary,
  getDashboardMonthly,
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

  // ---- API calls ----
  const summaryState = useApi(
    () => (username ? getDashboardSummary(username) : Promise.resolve(null)),
    [username]
  );

  const monthlyState = useApi(
    () => (username ? getDashboardMonthly(username) : Promise.resolve({})),
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

  // ---- Create transaction + refresh everything that depends on it ----
  const handleCreateTransaction = async (payload) => {
    if (!username) return;
    try {
      await createTransaction({ ...payload, username });

      const [txs, summary, monthly] = await Promise.all([
        getTransactions({ username }),
        getDashboardSummary(username),
        getDashboardMonthly(username),
      ]);

      transactionsState.setData(txs);
      summaryState.setData(summary);
      monthlyState.setData(monthly);
    } catch (err) {
      console.error(err);
    }
  };

  const loading =
    summaryState.loading ||
    monthlyState.loading ||
    budgetsState.loading ||
    transactionsState.loading;

  const error =
    summaryState.error ||
    monthlyState.error ||
    budgetsState.error ||
    transactionsState.error;

  // ---- Build the "overview" object that DashboardSummary expects ----
  const summary = summaryState.data || {};
  const monthly = monthlyState.data || {};

  const totalIncome = summary.totalIncome || 0;
  const totalExpenses = summary.totalExpenses || 0;
  const savings = totalIncome - totalExpenses;
  const savingsRate =
    totalIncome > 0 ? Math.round((savings / totalIncome) * 100) : 0;

  const monthLabel = new Date().toLocaleString(undefined, {
    month: "long",
    year: "numeric",
  });

  // monthly comes from backend as { "Food": 200, "Rent": 800, ... }
  const topCategories = Object.entries(monthly)
    .map(([name, amount]) => ({ name, amount }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  const overview = {
    month: monthLabel,
    totalIncome,
    totalExpenses,
    savings,
    savingsRate,
    topCategories,
    // carry this along in case you want to show it:
    goalsAchieved: summary.goalsAchieved || 0,
  };

  return (
    <>
      {loading && <LoadingSpinner />}
      <ErrorMessage error={error} />

      {!loading && !error && (
        <>
          <DashboardSummary overview={overview} />

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
