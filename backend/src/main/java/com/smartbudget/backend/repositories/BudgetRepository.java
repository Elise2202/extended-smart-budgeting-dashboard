package com.smartbudget.backend.repositories;

import com.smartbudget.backend.models.Budget;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface BudgetRepository extends MongoRepository<Budget, String> {
    List<Budget> findByUsername(String username);
}
