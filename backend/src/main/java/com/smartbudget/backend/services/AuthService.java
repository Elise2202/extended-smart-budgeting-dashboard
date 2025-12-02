package com.smartbudget.backend.services;

import com.smartbudget.backend.models.User;
import com.smartbudget.backend.repositories.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(User incoming) {
        String username = incoming.getUsername() != null
                ? incoming.getUsername().trim()
                : "";
        String rawPassword = incoming.getPassword() != null
                ? incoming.getPassword()
                : "";

        // ------- VALIDATION (same rules as frontend) -------
        if (username.isEmpty()) {
            throw new IllegalArgumentException("Username is required.");
        }

        if (username.length() < 3) {
            throw new IllegalArgumentException("Username must be at least 3 characters long.");
        }

        if (rawPassword.length() < 8) {
            throw new IllegalArgumentException("Password must be at least 8 characters long.");
        }

        if (rawPassword.chars().noneMatch(Character::isUpperCase)) {
            throw new IllegalArgumentException("Password must contain at least one uppercase letter.");
        }

        if (rawPassword.chars().noneMatch(Character::isDigit)) {
            throw new IllegalArgumentException("Password must contain at least one number.");
        }

        if (repo.findByUsername(username) != null) {
            throw new IllegalStateException("Username is already taken.");
        }

        // ------- CREATE USER (HASHED PASSWORD) -------
        User user = new User();
        user.setUsername(username);
        user.setPassword(passwordEncoder.encode(rawPassword)); // 🔐 store hash

        return repo.save(user);
    }

    public User login(String username, String rawPassword) {
        if (username == null || rawPassword == null) {
            return null;
        }

        User user = repo.findByUsername(username.trim());
        if (user == null) {
            return null;
        }

        // 🔐 compare hash
        if (!passwordEncoder.matches(rawPassword, user.getPassword())) {
            return null;
        }

        return user;
    }
}
