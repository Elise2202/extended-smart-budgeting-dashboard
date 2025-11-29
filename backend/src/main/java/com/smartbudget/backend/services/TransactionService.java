package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Transaction;
import com.smartbudget.backend.repositories.TransactionRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TransactionService {

    private final TransactionRepository transactionRepository;

    public TransactionService(TransactionRepository transactionRepository) {
        this.transactionRepository = transactionRepository;
    }

    public List<Transaction> getTransactionsByUser(String username) {
        return transactionRepository.findByUsername(username);
    }

    public List<Transaction> getTransactionsByCategory(String username, String category) {
        return transactionRepository.findByUsernameAndCategory(username, category);
    }

    public Transaction createTransaction(Transaction transaction) {
        return transactionRepository.save(transaction);
    }

    public Optional<Transaction> updateTransaction(String id, Transaction updated) {
        return transactionRepository.findById(id).map(existing -> {
            existing.setAmount(updated.getAmount());
            existing.setCategory(updated.getCategory());
            existing.setType(updated.getType());
            existing.setDate(updated.getDate());
            existing.setDescription(updated.getDescription());
            return transactionRepository.save(existing);
        });
    }

    public boolean deleteTransaction(String id) {
        if (transactionRepository.existsById(id)) {
            transactionRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
