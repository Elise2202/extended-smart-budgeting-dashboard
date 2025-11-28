package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Budget;
import com.smartbudget.backend.services.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<Budget> create(@RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.createBudget(budget));
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Budget>> getUserBudgets(@PathVariable String username) {
        return ResponseEntity.ok(budgetService.getBudgets(username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> update(@PathVariable String id, @RequestBody Budget budget) {
        Budget updated = budgetService.updateBudget(id, budget);
        return updated != null ? ResponseEntity.ok(updated) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        boolean deleted = budgetService.deleteBudget(id);
        return deleted ? ResponseEntity.ok("Deleted") : ResponseEntity.notFound().build();
    }
}
