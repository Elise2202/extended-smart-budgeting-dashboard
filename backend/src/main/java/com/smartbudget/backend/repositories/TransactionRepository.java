package com.smartbudget.backend.repositories;

import com.smartbudget.backend.models.Transaction;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TransactionRepository extends MongoRepository<Transaction, String> {

    List<Transaction> findByUsername(String username);

    List<Transaction> findByUsernameAndCategory(String username, String category);

}
