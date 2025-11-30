package com.smartbudget.backend.repositories;

import com.smartbudget.backend.models.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface NotificationRepository extends MongoRepository<Notification, String> {
    List<Notification> findByUsernameOrderByCreatedAtDesc(String username);
}
