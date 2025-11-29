package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Notification;
import com.smartbudget.backend.repositories.NotificationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository repo;

    public NotificationService(NotificationRepository repo) {
        this.repo = repo;
    }

    public Notification sendNotification(String username, String type, String message) {
        Notification n = new Notification(username, type, message);
        return repo.save(n);
    }

    public List<Notification> getNotifications(String username) {
        return repo.findByUsernameOrderByCreatedAtDesc(username);
    }
}
