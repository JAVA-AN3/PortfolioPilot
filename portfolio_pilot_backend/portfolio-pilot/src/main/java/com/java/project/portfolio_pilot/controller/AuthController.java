package com.java.project.portfolio_pilot.controller;

import com.java.project.portfolio_pilot.dto.UserRegistrationDTO;
import com.java.project.portfolio_pilot.model.User;
import com.java.project.portfolio_pilot.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Registers a new user in the system.
     *
     * @param registrationDTO The data transfer object containing user registration details.
     * @return A ResponseEntity containing a success message or an error message if registration fails.
     */
    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody UserRegistrationDTO registrationDTO) {
        try {
            User registeredUser = userService.registerUser(registrationDTO);
            return ResponseEntity.ok("User registered successfully with ID: " + registeredUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
