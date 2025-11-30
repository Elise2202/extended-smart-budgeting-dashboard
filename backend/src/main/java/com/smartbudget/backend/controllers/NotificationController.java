package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Notification;
import com.smartbudget.backend.services.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin
public class NotificationController {

    private final NotificationService service;

    public NotificationController(NotificationService service) {
        this.service = service;
    }

    @GetMapping("/{username}")
    public ResponseEntity<List<Notification>> getAll(@PathVariable String username) {
        return ResponseEntity.ok(service.getNotifications(username));
    }

    @PostMapping("/test")
    public ResponseEntity<Notification> sendTest(@RequestParam String username) {
        return ResponseEntity.ok(
            service.sendNotification(username, "TEST", "Sample Notification")
        );
    }
}
