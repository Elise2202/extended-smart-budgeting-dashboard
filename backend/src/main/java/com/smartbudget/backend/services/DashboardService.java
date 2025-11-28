package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.models.Goal;
import com.smartbudget.backend.repositories.TransactionRepository;
import com.smartbudget.backend.repositories.GoalRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class DashboardService {

    private final TransactionRepository transactionRepository;
    private final GoalRepository goalRepository;

    public DashboardService(TransactionRepository transactionRepository,
                            GoalRepository goalRepository) {
        this.transactionRepository = transactionRepository;
        this.goalRepository = goalRepository;
    }

    public Map<String, Object> getSummary(String username) {

        List<Transaction> transactions = transactionRepository.findByUsername(username);
        List<Goal> goals = goalRepository.findByUsername(username);

        double totalIncome = transactions.stream()
                .filter(t -> t.getType().equalsIgnoreCase("income"))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpenses = transactions.stream()
                .filter(t -> t.getType().equalsIgnoreCase("expense"))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = totalIncome - totalExpenses;

        // FIXED: Replace getCurrentAmount() with getSavedAmount()
        long achievedGoals = goals.stream()
                .filter(g -> g.getSavedAmount() >= g.getTargetAmount())
                .count();

        Map<String, Object> summary = new HashMap<>();
        summary.put("totalIncome", totalIncome);
        summary.put("totalExpenses", totalExpenses);
        summary.put("balance", balance);
        summary.put("goalsAchieved", achievedGoals);

        return summary;
    }

    public Map<String, Double> getMonthlySpending(String username) {
        Map<String, Double> result = new HashMap<>();

        List<Transaction> transactions = transactionRepository.findByUsername(username);

        YearMonth currentMonth = YearMonth.now();

        transactions.stream()
                .filter(t -> {
                    LocalDate date = t.getDate();
                    return date.getYear() == currentMonth.getYear()
                            && date.getMonthValue() == currentMonth.getMonthValue()
                            && t.getType().equalsIgnoreCase("expense");
                })
                .forEach(t -> {
                    result.merge(t.getCategory(), t.getAmount(), Double::sum);
                });

        return result;
    }

    public Map<String, Double> getGoalsProgress(String username) {
        Map<String, Double> progress = new HashMap<>();

        List<Goal> goals = goalRepository.findByUsername(username);

        goals.forEach(g -> {
            // FIXED: Replace getCurrentAmount() with getSavedAmount()
            double percent = (g.getSavedAmount() / g.getTargetAmount()) * 100;
            progress.put(g.getTitle(), percent);
        });

        return progress;
    }
}
