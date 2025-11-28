package com.smartbudget.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "goals")
public class Goal {

    @Id
    private String id;

    private String username;
    private String title;
    private double targetAmount;
    private double currentAmount;

    public Goal() {}

    public Goal(String username, String title, double targetAmount, double currentAmount) {
        this.username = username;
        this.title = title;
        this.targetAmount = targetAmount;
        this.currentAmount = currentAmount;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public String getTitle() {
        return title;
    }

    public double getTargetAmount() {
        return targetAmount;
    }

    public double getCurrentAmount() {
        return currentAmount;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setTargetAmount(double targetAmount) {
        this.targetAmount = targetAmount;
    }

    public void setCurrentAmount(double currentAmount) {
        this.currentAmount = currentAmount;
    }
}
