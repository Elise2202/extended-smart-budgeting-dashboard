package com.smartbudget.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "notifications")
public class Notification {

    @Id
    private String id;

    private String username;
    private String type;        // "BUDGET_ALERT", "GOAL_ALERT", "INFO"
    private String message;

    private boolean read = false;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Notification() {}

    public Notification(String username, String type, String message) {
        this.username = username;
        this.type = type;
        this.message = message;
        this.read = false;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    // (Add them or use Lombok if enabled)
}
