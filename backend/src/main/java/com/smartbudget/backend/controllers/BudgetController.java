package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Budget;
import com.smartbudget.backend.services.BudgetService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/budgets")
@CrossOrigin("*")
public class BudgetController {

    private final BudgetService budgetService;

    public BudgetController(BudgetService budgetService) {
        this.budgetService = budgetService;
    }

    @PostMapping
    public ResponseEntity<Budget> create(@RequestBody Budget budget) {
        return ResponseEntity.ok(budgetService.create(budget));
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Budget>> getAll(@PathVariable String username) {
        return ResponseEntity.ok(budgetService.getAll(username));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Budget> update(@PathVariable String id, @RequestBody Budget updated) {
        return ResponseEntity.ok(budgetService.update(id, updated));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        budgetService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
