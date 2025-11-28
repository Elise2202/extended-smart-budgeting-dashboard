package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Budget;
import com.smartbudget.backend.repositories.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository repo;
    private final NotificationService notificationService;

    public BudgetService(BudgetRepository repo, NotificationService notificationService) {
        this.repo = repo;
        this.notificationService = notificationService;
    }

    public Budget create(Budget budget) {
        return repo.save(budget);
    }

    public List<Budget> getAll(String username) {
        return repo.findByUsername(username);
    }

    public Budget update(String id, Budget updated) {
        Budget budget = repo.findById(id).orElse(null);
        if (budget == null) return null;

        budget.setCategory(updated.getCategory());
        budget.setLimitAmount(updated.getLimitAmount());
        budget.setSpentAmount(updated.getSpentAmount());
        budget.setUsername(updated.getUsername());

        Budget saved = repo.save(budget);

        if (saved.getLimitAmount() != null && saved.getSpentAmount() != null) {
            if (saved.getSpentAmount() > saved.getLimitAmount()) {
                notificationService.sendNotification(
                        saved.getUsername(),
                        "BUDGET_ALERT",
                        "⚠ You exceeded your budget for: " + saved.getCategory()
                );
            }
        }


        return saved;
    }

    public void delete(String id) {
        repo.deleteById(id);
    }
}
