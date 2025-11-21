package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.repositories.TransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/transactions")
@CrossOrigin("*")
public class TransactionController {

    @Autowired
    private TransactionRepository repo;

    @PostMapping
    public Transaction add(@RequestBody Transaction t) {
        return repo.save(t);
    }

    @GetMapping("/{userId}")
    public List<Transaction> list(@PathVariable String userId) {
        return repo.findByUserId(userId);
    }
}
