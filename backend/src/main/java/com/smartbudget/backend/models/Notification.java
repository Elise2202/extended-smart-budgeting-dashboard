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

    // ----- Getters -----
    public String getId() { return id; }
    public String getUsername() { return username; }
    public String getType() { return type; }
    public String getMessage() { return message; }
    public boolean isRead() { return read; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // ----- Setters -----
    public void setId(String id) { this.id = id; }
    public void setUsername(String username) { this.username = username; }
    public void setType(String type) { this.type = type; }
    public void setMessage(String message) { this.message = message; }
    public void setRead(boolean read) { this.read = read; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
