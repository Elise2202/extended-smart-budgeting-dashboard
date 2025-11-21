package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Goal;
import com.smartbudget.backend.repositories.GoalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/goals")
@CrossOrigin("*")
public class GoalController {

    @Autowired
    private GoalRepository repo;

    @PostMapping
    public Goal add(@RequestBody Goal g) {
        return repo.save(g);
    }

    @GetMapping("/{userId}")
    public List<Goal> list(@PathVariable String userId) {
        return repo.findByUserId(userId);
    }
}
