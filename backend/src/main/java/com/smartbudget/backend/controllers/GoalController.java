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
    public ResponseEntity<List<Goal>> getAll(@PathVariable String username) {
        return ResponseEntity.ok(goalService.getAll(username));
    }

    @PostMapping
    public ResponseEntity<Goal> create(@RequestBody Goal goal) {
        return ResponseEntity.ok(goalService.create(goal));
    }

    // GoalController.java
    @PutMapping("/{id}")
    public ResponseEntity<Goal> update(@PathVariable String id, @RequestBody Goal updated) {
        return goalService.update(id, updated)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }


    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable String id) {
        goalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}
