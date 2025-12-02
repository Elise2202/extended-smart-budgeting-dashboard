package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Budget;
import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.repositories.BudgetRepository;
import com.smartbudget.backend.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class BudgetService {

    private final BudgetRepository repo;
    private final NotificationService notificationService;
    private final TransactionRepository transactionRepository;

    public BudgetService(BudgetRepository repo,
                         NotificationService notificationService,
                         TransactionRepository transactionRepository) {
        this.repo = repo;
        this.notificationService = notificationService;
        this.transactionRepository = transactionRepository;
    }

    public Budget create(Budget budget) {
        return repo.save(budget);
    }

    /**
     * Get budgets for a user.
     * If none exist yet, auto-create one budget per expense category with limit=0
     * and spentAmount based on current transactions.
     */
    public List<Budget> getAll(String username) {

        // 1) Load existing budgets
        List<Budget> budgets = new ArrayList<>(repo.findByUsername(username));

        // 2) Compute spending per category from ALL expense transactions
        List<Transaction> tx = transactionRepository.findByUsername(username);

        Map<String, Double> spentByCategory = new HashMap<>();

        tx.stream()
                .filter(t -> "expense".equalsIgnoreCase(
                        t.getType() == null ? "" : t.getType()
                ))
                .forEach(t -> {
                    String category = t.getCategory() == null ? "Uncategorized" : t.getCategory();
                    double amount = t.getAmount();
                    spentByCategory.merge(category, amount, Double::sum);
                });

        // 3) If there are no budgets yet, create one per category with limit = 0
        if (budgets.isEmpty()) {
            for (Map.Entry<String, Double> entry : spentByCategory.entrySet()) {
                Budget b = new Budget();
                b.setUsername(username);
                b.setCategory(entry.getKey());
                b.setLimitAmount(0.0);
                b.setSpentAmount(entry.getValue());
                budgets.add(repo.save(b));
            }
        } else {
            // 4) Update spentAmount for each existing budget
            for (Budget b : budgets) {
                double spent = spentByCategory.getOrDefault(b.getCategory(), 0.0);
                b.setSpentAmount(spent);
            }
            repo.saveAll(budgets);
        }

        return budgets;
    }

    public Budget update(String id, Budget updated) {
        Budget budget = repo.findById(id).orElse(null);
        if (budget == null) return null;

        // Allow changing category + limit; spentAmount is always recomputed in getAll()
        budget.setCategory(updated.getCategory());
        budget.setLimitAmount(updated.getLimitAmount());

        Budget saved = repo.save(budget);

        // Notification if limit exceeded
        Double limit = saved.getLimitAmount();
        Double spent = saved.getSpentAmount();
        if (limit != null && spent != null && spent > limit) {
            notificationService.sendNotification(
                    saved.getUsername(),
                    "BUDGET_ALERT",
                    "⚠ You exceeded your budget for: " + saved.getCategory()
            );
        }

        return saved;
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
