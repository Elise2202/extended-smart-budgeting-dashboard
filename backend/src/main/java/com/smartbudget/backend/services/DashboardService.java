package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.models.Goal;
import com.smartbudget.backend.repositories.TransactionRepository;
import com.smartbudget.backend.repositories.GoalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.TextStyle;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;

    public DashboardService(TransactionRepository transactionRepository,
                            GoalRepository goalRepository) {
        this.transactionRepository = transactionRepository;
        this.goalRepository = goalRepository;
    }

    /**
     * Summary used by the main Dashboard.
     *
     * Returns a map with:
     *  - month          (e.g. "December 2025")
     *  - totalIncome
     *  - totalExpenses
     *  - savings        (income - expenses, but not below 0)
     *  - savingsRate    (savings / income * 100, if income > 0)
     *  - goalsAchieved
     *  - topCategories  (List<Map<String,Object>> with name + amount)
     */
    public Map<String, Object> getSummary(String username) {

        List<Transaction> transactions = transactionRepository.findByUsername(username);
        if (transactions == null) {
            transactions = Collections.emptyList();
        }

        List<Goal> goals = goalRepository.findByUsername(username);
        if (goals == null) {
            goals = Collections.emptyList();
        }

        // ---- income / expenses (null-safe on type) ----
        double totalIncome = transactions.stream()
                .filter(t -> {
                    String type = t.getType();
                    return type != null && type.equalsIgnoreCase("income");
                })
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpenses = transactions.stream()
                .filter(t -> {
                    String type = t.getType();
                    return type != null && type.equalsIgnoreCase("expense");
                })
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = totalIncome - totalExpenses;
        double savings = Math.max(0, balance);
        double savingsRate = (totalIncome > 0)
                ? (savings / totalIncome) * 100.0
                : 0.0;

        // ---- goals achieved (null-safe) ----
        long achievedGoals = goals.stream()
                .filter(g -> {
                    Double target = g.getTargetAmount();
                    Double saved = g.getSavedAmount();
                    return target != null && target > 0
                           && saved != null && saved >= target;
                })
                .count();

        // ---- top spending categories for current month ----
        YearMonth currentMonth = YearMonth.now();
        LocalDate start = currentMonth.atDay(1);
        LocalDate end = currentMonth.atEndOfMonth();

        Map<String, Double> byCategory = transactions.stream()
                .filter(t -> {
                    String type = t.getType();
                    LocalDate date = t.getDate();
                    return type != null
                            && type.equalsIgnoreCase("expense")
                            && date != null
                            && !date.isBefore(start)
                            && !date.isAfter(end);
                })
                .collect(Collectors.groupingBy(
                        t -> Optional.ofNullable(t.getCategory()).orElse("Uncategorized"),
                        Collectors.summingDouble(Transaction::getAmount)
                ));

        // sort categories desc by amount and take top 5
        List<Map<String, Object>> topCategories = byCategory.entrySet().stream()
                .sorted(Map.Entry.<String, Double>comparingByValue().reversed())
                .limit(5)
                .map(e -> {
                    Map<String, Object> m = new HashMap<>();
                    m.put("name", e.getKey());
                    m.put("amount", e.getValue());
                    return m;
                })
                .collect(Collectors.toList());

        // ---- build response map for DashboardSummary.jsx ----
        Map<String, Object> summary = new HashMap<>();
        String monthLabel = currentMonth.getMonth()
                .getDisplayName(TextStyle.FULL, Locale.ENGLISH)
                + " " + currentMonth.getYear();

        summary.put("month", monthLabel);
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("savings", savings);
        summary.put("savingsRate", Math.round(savingsRate * 100.0) / 100.0); // 2 decimals
        summary.put("balance", balance);
        summary.put("goalsAchieved", achievedGoals);
        summary.put("topCategories", topCategories);

        return summary;
    }

    public Map<String, Double> getMonthlySpending(String username) {
        Map<String, Double> result = new HashMap<>();

        List<Transaction> transactions = transactionRepository.findByUsername(username);
        if (transactions == null) {
            return result;
        }

        YearMonth currentMonth = YearMonth.now();

        transactions.stream()
                .filter(t -> {
                    LocalDate date = t.getDate();
                    String type = t.getType();
                    return date != null
                            && date.getYear() == currentMonth.getYear()
                            && date.getMonthValue() == currentMonth.getMonthValue()
                            && type != null
                            && type.equalsIgnoreCase("expense");
                })
                .forEach(t -> result.merge(
                        Optional.ofNullable(t.getCategory()).orElse("Uncategorized"),
                        t.getAmount(),
                        Double::sum
                ));

        return result;
    }

    public Map<String, Double> getGoalsProgress(String username) {
        Map<String, Double> progress = new HashMap<>();

        List<Goal> goals = goalRepository.findByUsername(username);
        if (goals == null) {
            return progress;
        }

        goals.forEach(g -> {
            Double target = g.getTargetAmount();
            Double saved = g.getSavedAmount();
            if (target != null && target > 0 && saved != null) {
                double percent = (saved / target) * 100;
                progress.put(g.getTitle(), percent);
            }
        });

        return progress;
    }
}
