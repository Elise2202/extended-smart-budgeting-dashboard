package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.services.TransactionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transactions")
@CrossOrigin("*")
public class TransactionController {

    private final TransactionService transactionService;

    public TransactionController(TransactionService transactionService) {
        this.transactionService = transactionService;
    }

    // Create
    @PostMapping("/create")
    public ResponseEntity<Transaction> create(@RequestBody Transaction transaction) {
        return ResponseEntity.ok(transactionService.createTransaction(transaction));
    }

    // Get all by username
    @GetMapping("/{username}")
    public ResponseEntity<List<Transaction>> getByUser(@PathVariable String username) {
        return ResponseEntity.ok(transactionService.getTransactionsByUser(username));
    }

    // Get by category
    @GetMapping("/{username}/category/{category}")
    public ResponseEntity<List<Transaction>> getByCategory(
            @PathVariable String username,
            @PathVariable String category) {

        return ResponseEntity.ok(transactionService.getTransactionsByCategory(username, category));
    }

    // Update
    @PutMapping("/update/{id}")
    public ResponseEntity<?> update(@PathVariable String id, @RequestBody Transaction updated) {
        return transactionService.updateTransaction(id, updated)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Delete
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> delete(@PathVariable String id) {
        boolean deleted = transactionService.deleteTransaction(id);

        if (deleted) return ResponseEntity.ok("Transaction deleted");
        return ResponseEntity.notFound().build();
    }
}
