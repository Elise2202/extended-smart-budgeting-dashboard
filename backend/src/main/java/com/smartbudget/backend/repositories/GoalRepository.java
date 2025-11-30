package com.smartbudget.backend.repositories;

import com.smartbudget.backend.models.Goal;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface GoalRepository extends MongoRepository<Goal, String> {

    List<Goal> findByUsername(String username);

}
