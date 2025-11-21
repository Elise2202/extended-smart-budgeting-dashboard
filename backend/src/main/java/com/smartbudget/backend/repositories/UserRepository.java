package com.smartbudget.backend.repositories;

import org.springframework.data.mongodb.repository.MongoRepository;
import com.smartbudget.backend.models.User;

public interface UserRepository extends MongoRepository<User, String> {
    User findByUsername(String username);
}
