package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Goal;
import com.smartbudget.backend.repositories.GoalRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class GoalService {

    private final GoalRepository goalRepository;

    public GoalService(GoalRepository goalRepository) {
        this.goalRepository = goalRepository;
    }

    public List<Goal> getGoalsByUsername(String username) {
        return goalRepository.findByUsername(username);
    }

    public Goal createGoal(Goal goal) {
        return goalRepository.save(goal);
    }

    public Goal updateGoal(String id, Goal updatedGoal) {
        return goalRepository.findById(id).map(existing -> {
            existing.setTitle(updatedGoal.getTitle());
            existing.setTargetAmount(updatedGoal.getTargetAmount());
            existing.setCurrentAmount(updatedGoal.getCurrentAmount());
            return goalRepository.save(existing);
        }).orElse(null);
    }

    public void deleteGoal(String id) {
        goalRepository.deleteById(id);
    }
}
