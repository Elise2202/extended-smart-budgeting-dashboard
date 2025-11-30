package com.smartbudget.backend.controllers;

import com.smartbudget.backend.models.Settings;
import com.smartbudget.backend.services.SettingsService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@CrossOrigin("*")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    // GET /api/settings?username=joy
    @GetMapping
    public ResponseEntity<Settings> getSettings(@RequestParam String username) {
        return ResponseEntity.ok(settingsService.getSettingsForUser(username));
    }

    // PUT /api/settings?username=joy
    @PutMapping
    public ResponseEntity<Settings> updateSettings(
            @RequestParam String username,
            @RequestBody Settings payload
    ) {
        return ResponseEntity.ok(settingsService.updateSettingsForUser(username, payload));
    }
}
