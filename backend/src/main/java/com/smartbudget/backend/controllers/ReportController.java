package com.smartbudget.backend.controllers;

import com.smartbudget.backend.services.ReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin("*")
public class ReportController {

    private final ReportService reportService;

    public ReportController(ReportService reportService) {
        this.reportService = reportService;
    }

    // ✅ Monthly summary: income, expenses, balance
    @GetMapping("/monthly")
    public ResponseEntity<?> getMonthlyReport(
            @RequestParam String username,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        return ResponseEntity.ok(reportService.getMonthlyReport(username, year, month));
    }

    // ✅ Category totals for the month (expenses by category)
    @GetMapping("/categories")
    public ResponseEntity<?> getCategoryReport(
            @RequestParam String username,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month) {

        return ResponseEntity.ok(reportService.getCategoryReport(username, year, month));
    }
}
