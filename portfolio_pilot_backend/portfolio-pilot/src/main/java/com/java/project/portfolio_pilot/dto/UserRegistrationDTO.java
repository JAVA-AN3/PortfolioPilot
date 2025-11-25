package com.java.project.portfolio_pilot.dto;

// This class is a simple container for data coming from the Frontend.
// It is NOT an Entity (no @Entity annotation).
public class UserRegistrationDTO {

    private String username;
    private String email;
    private String password;

    // --- CONSTRUCTORS ---
    public UserRegistrationDTO() {
    }

    public UserRegistrationDTO(String username, String email, String password) {
        this.username = username;
        this.email = email;
        this.password = password;
    }

    // --- GETTERS & SETTERS ---
    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}