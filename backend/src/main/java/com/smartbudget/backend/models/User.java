package com.smartbudget.backend.models;

import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "users")
public class User {

    @Id
    private String id;

    private String username;

    // We want to ACCEPT password from JSON, but never SEND it back.
    @JsonProperty(access = JsonProperty.Access.WRITE_ONLY)
    private String password;   // stores the *hashed* password in DB

    public User() {}

    public User(String username, String password) {
        this.username = username;
        this.password = password;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    // hashed password inside DB
    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
