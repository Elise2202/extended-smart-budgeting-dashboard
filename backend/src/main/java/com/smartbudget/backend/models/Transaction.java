package com.smartbudget.backend.models;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@Document("transactions")
public class Transaction {
    @Id
    private String id;
    private String userId;
    private String category;
    private double amount;
}
