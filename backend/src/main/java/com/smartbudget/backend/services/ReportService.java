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

    private YearMonth resolveYearMonth(Integer year, Integer month) {
        if (year == null || month == null) {
            return YearMonth.now();
        }
        return YearMonth.of(year, month);
    }

    /**
     * Basic monthly report:
     * - totalIncome
     * - totalExpenses
     * - balance
     */
    public Map<String, Object> getMonthlyReport(String username, Integer year, Integer month) {

        YearMonth ym = resolveYearMonth(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        // Load all transactions for this user and filter in Java
        List<Transaction> allTransactions = transactionRepository.findByUsername(username);

        List<Transaction> monthTransactions = allTransactions.stream()
                .filter(t -> {
                    LocalDate d = t.getDate();
                    return d != null && !d.isBefore(start) && !d.isAfter(end);
                })
                .toList();

        double totalIncome = monthTransactions.stream()
                .filter(t -> "income".equalsIgnoreCase(
                        t.getType() == null ? "" : t.getType()
                ))
                .mapToDouble(Transaction::getAmount)
                .sum();

        double totalExpenses = monthTransactions.stream()
                .filter(t -> "expense".equalsIgnoreCase(
                        t.getType() == null ? "" : t.getType()
                ))
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
     * Category report for a month:
     * { "Food": 120.0, "Transport": 50.0, ... } (expenses only)
     */
    public Map<String, Double> getCategoryReport(String username, Integer year, Integer month) {

        YearMonth ym = resolveYearMonth(year, month);
        LocalDate start = ym.atDay(1);
        LocalDate end = ym.atEndOfMonth();

        List<Transaction> allTransactions = transactionRepository.findByUsername(username);

        Map<String, Double> result = new HashMap<>();

        allTransactions.stream()
                .filter(t -> {
                    LocalDate d = t.getDate();
                    String type = t.getType() == null ? "" : t.getType();
                    return d != null
                            && !d.isBefore(start)
                            && !d.isAfter(end)
                            && "expense".equalsIgnoreCase(type);
                })
                .forEach(t -> {
                    String category = t.getCategory() == null ? "Uncategorized" : t.getCategory();
                    double amount = t.getAmount();
                    result.merge(category, amount, Double::sum);
                });

        return result;
    }
}
