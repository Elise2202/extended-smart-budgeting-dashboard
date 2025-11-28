package com.smartbudget.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "transactions")
public class Transaction {

    @Id
    private String id;

    private String username;      // Link to the logged user
    private double amount;
    private String category;
    private String type;          // "income" or "expense"
    private LocalDate date;
    private String description;

    public Transaction() {}

    public Transaction(String username, double amount, String category, String type, LocalDate date, String description) {
        this.username = username;
        this.amount = amount;
        this.category = category;
        this.type = type;
        this.date = date;
        this.description = description;
    }

    // === Getters & Setters ===

    public String getId() { return id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public double getAmount() { return amount; }
    public void setAmount(double amount) { this.amount = amount; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
}
