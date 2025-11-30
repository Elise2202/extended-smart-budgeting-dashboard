package com.smartbudget.backend.services;

import com.smartbudget.backend.models.Settings;
import com.smartbudget.backend.repositories.SettingsRepository;
import org.springframework.stereotype.Service;

@Service
public class SettingsService {

    private final SettingsRepository repository;

    public SettingsService(SettingsRepository repository) {
        this.repository = repository;
    }

    public Settings getSettingsForUser(String username) {
        // If user has no settings yet, create sensible defaults
        return repository.findByUsername(username).orElseGet(() -> {
            Settings s = new Settings();
            s.setUsername(username);
            s.setCurrency("USD");
            s.setDefaultPeriod("MONTH");
            s.setLocale("en-US");
            return repository.save(s);
        });
    }

    public Settings updateSettingsForUser(String username, Settings incoming) {
        Settings existing = repository.findByUsername(username).orElseGet(() -> {
            Settings s = new Settings();
            s.setUsername(username);
            return s;
        });

        existing.setCurrency(incoming.getCurrency());
        existing.setDefaultPeriod(incoming.getDefaultPeriod());
        existing.setLocale(incoming.getLocale());

        return repository.save(existing);
    }
}
