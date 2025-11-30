package com.smartbudget.backend.repositories;

import com.smartbudget.backend.models.Settings;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

public interface SettingsRepository extends MongoRepository<Settings, String> {
    Optional<Settings> findByUsername(String username);
}
