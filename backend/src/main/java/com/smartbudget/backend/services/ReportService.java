package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.YearMonth;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ReportService {

    private final TransactionRepository transactionRepository;

    public ReportService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    /**
     * Basic monthly report:
     * - totalIncome
     * - totalExpenses
     * - balance
     */
    public Map<String, Object> getMonthlyReport(String username, Integer year, Integer month) {

        YearMonth ym;
        if (year == null || month == null) {
            ym = YearMonth.now(); // default: current month
        } else {
            ym = YearMonth.of(year, month);
        }

        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> transactions =
                transactionRepository.findByUsernameAndDateBetween(username, start, end);

        double totalIncome = transactions.stream()
                .filter(t -> "income".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpenses = transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double balance = totalIncome - totalExpenses;

        Map<String, Object> result = new HashMap<>();
        result.put("username", username);
        result.put("year", ym.getYear());
        result.put("month", ym.getMonthValue());
        result.put("totalIncome", totalIncome);
        result.put("totalExpenses", totalExpenses);
        result.put("balance", balance);

        return result;
    }

    /**
     * Basic category report for a month:
     * { "Food": 120.0, "Transport": 50.0, ... } (expenses only)
     */
    public Map<String, Double> getCategoryReport(String username, Integer year, Integer month) {

        YearMonth ym;
        if (year == null || month == null) {
            ym = YearMonth.now(); // default: current month
        } else {
            ym = YearMonth.of(year, month);
        }

        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> transactions =
                transactionRepository.findByUsernameAndDateBetween(username, start, end);

        Map<String, Double> result = new HashMap<>();

        transactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(t.getType()))
                .forEach(t -> {
                    String category = t.getCategory();
                    double amount = t.getAmount();
                    result.merge(category, amount, Double::sum);
                });

        return result;
    }
}
