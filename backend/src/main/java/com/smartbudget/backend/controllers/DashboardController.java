package com.smartbudget.backend.controllers;

import com.smartbudget.backend.services.DashboardService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin("*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/summary")
    public ResponseEntity<?> getSummary(@RequestParam String username) {
        return ResponseEntity.ok(dashboardService.getSummary(username));
    }

    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthly(@RequestParam String username) {
        return ResponseEntity.ok(dashboardService.getMonthlySpending(username));
    }

    @GetMapping("/goals-progress")
    public ResponseEntity<?> getGoalsProgress(@RequestParam String username) {
        return ResponseEntity.ok(dashboardService.getGoalsProgress(username));
    }
}
