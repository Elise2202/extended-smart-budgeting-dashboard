package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Goal;
import com.smartbudget.backend.services.GoalService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/goals")
public class GoalController {

    private final GoalService goalService;

    public GoalController(GoalService goalService) {
        this.goalService = goalService;
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Goal>> getGoals(@PathVariable String username) {
        return ResponseEntity.ok(goalService.getGoalsByUsername(username));
    }

    @PostMapping
    public ResponseEntity<Goal> createGoal(@RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.createGoal(goal));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Goal> updateGoal(@PathVariable String id, @RequestBody Goal updatedGoal) {
        Goal result = goalService.updateGoal(id, updatedGoal);
        return ResponseEntity.ok(result);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteGoal(@PathVariable String id) {
        goalService.deleteGoal(id);
        return ResponseEntity.ok("Goal deleted successfully");
    }
}
