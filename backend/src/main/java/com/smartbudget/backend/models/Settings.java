package com.smartbudget.backend.models;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "settings")
public class Settings {

    @Id
    private String id;

    private String username;
    private String currency;
    private String defaultPeriod;   // "MONTH", "WEEK", "YEAR"
    private String locale;          // e.g. "en-US"

    public Settings() {}

    public Settings(String username, String currency, String defaultPeriod, String locale) {
        this.username = username;
        this.currency = currency;
        this.defaultPeriod = defaultPeriod;
        this.locale = locale;
    }

    public String getId() {
        return id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getDefaultPeriod() {
        return defaultPeriod;
    }

    public void setDefaultPeriod(String defaultPeriod) {
        this.defaultPeriod = defaultPeriod;
    }

    public String getLocale() {
        return locale;
    }

    public void setLocale(String locale) {
        this.locale = locale;
    }
}
