package com.smartbudget.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;

@Document(collection = "budgets")
public class Budget {

    @Id
    private String id;

    private String username;
    private String category;
    private double limitAmount;
    private double spentAmount;
    private LocalDateTime createdAt = LocalDateTime.now();

    public Budget() {}

    public Budget(String username, String category, double limitAmount) {
        this.username = username;
        this.category = category;
        this.limitAmount = limitAmount;
        this.spentAmount = 0;
        this.createdAt = LocalDateTime.now();
    }

    // ---------- GETTERS ----------
    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getCategory() {
        return category;
    }

    public double getLimitAmount() {
        return limitAmount;
    }

    public double getSpentAmount() {
        return spentAmount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    // ---------- SETTERS ----------
    public void setId(String id) {
        this.id = id;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public void setLimitAmount(double limitAmount) {
        this.limitAmount = limitAmount;
    }

    public void setSpentAmount(double spentAmount) {
        this.spentAmount = spentAmount;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
