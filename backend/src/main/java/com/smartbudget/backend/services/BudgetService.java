package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Budget;
import com.smartbudget.backend.repositories.BudgetRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BudgetService {

    private final BudgetRepository budgetRepository;

    public BudgetService(BudgetRepository budgetRepository) {
        this.budgetRepository = budgetRepository;
    }

    public Budget createBudget(Budget budget) {
        return budgetRepository.save(budget);
    }

    public List<Budget> getBudgets(String username) {
        return budgetRepository.findByUsername(username);
    }

    public Budget updateBudget(String id, Budget updated) {
        return budgetRepository.findById(id).map(existing -> {
            existing.setCategory(updated.getCategory());
            existing.setLimitAmount(updated.getLimitAmount());
            existing.setSpentAmount(updated.getSpentAmount());
            return budgetRepository.save(existing);
        }).orElse(null);
    }

    public boolean deleteBudget(String id) {
        if (budgetRepository.existsById(id)) {
            budgetRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
