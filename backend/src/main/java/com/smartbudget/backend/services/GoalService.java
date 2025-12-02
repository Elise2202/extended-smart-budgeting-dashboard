package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Goal;
import com.smartbudget.backend.repositories.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class GoalService {

    private final GoalRepository repo;
    private final NotificationService notificationService;

    public GoalService(GoalRepository repo, NotificationService notificationService) {
        this.repo = repo;
        this.notificationService = notificationService;
    }

    public Goal create(Goal goal) {
        return repo.save(goal);
    }

    public List<Goal> getAll(String username) {
        return repo.findByUsername(username);
    }

    // GoalService.java
    public Optional<Goal> update(String id, Goal updated) {
    return repo.findById(id).map(goal -> {
        goal.setTitle(updated.getTitle());
        goal.setTargetAmount(updated.getTargetAmount());
        goal.setSavedAmount(updated.getSavedAmount());
        goal.setUsername(updated.getUsername());
        Goal saved = repo.save(goal);

        if (saved.getTargetAmount() != null && saved.getSavedAmount() != null) {
            double progress = (saved.getSavedAmount() / saved.getTargetAmount()) * 100.0;
            if (progress >= 80) {
                notificationService.sendNotification(
                    saved.getUsername(),
                    "GOAL_ALERT",
                    "🎯 You are close to achieving your goal: " + saved.getTitle()
                );
            }
        }

        return saved;
    });
}

    public void delete(String id) {
        repo.deleteById(id);
    }
}
