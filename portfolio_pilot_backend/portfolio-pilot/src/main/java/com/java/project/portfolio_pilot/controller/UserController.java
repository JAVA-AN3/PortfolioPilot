package com.java.project.portfolio_pilot.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.project.portfolio_pilot.model.User;
import com.java.project.portfolio_pilot.repository.UserRepository;
import com.java.project.portfolio_pilot.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;
    private final UserService userService;

    public UserController(UserRepository userRepository, UserService userService) {
        this.userRepository = userRepository;
        this.userService = userService;
    }

    /**
     * Fetches current authenticated user details.
     * Uses @AuthenticationPrincipal to resolve the user from the JWT token.
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body("Not authenticated");
        }

        User user = userRepository.findByUsername(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found in database"));

        // Map data to a simple structure (avoiding creating a new DTO class for now)
        return ResponseEntity.ok(Map.of(
            "username", user.getUsername(),
            "email", user.getEmail()
        ));
    }

    // Endpoint to change password
    @PutMapping("/change-password")
public ResponseEntity<?> changePassword(
        @AuthenticationPrincipal UserDetails userDetails,
        @RequestBody Map<String, String> passwords) {
    
    try {
        userService.updatePassword(
            userDetails.getUsername(), 
            passwords.get("oldPassword"), 
            passwords.get("newPassword")
        );
        return ResponseEntity.ok("Password updated successfully!");
    } catch (RuntimeException e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

    //Enpoint to change username
    @PutMapping("/update-profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody Map<String, String> data) {
        try {
            userService.updateUsername(userDetails.getUsername(), data.get("newUsername"));
            return ResponseEntity.ok("Profile updated! Please log in again with your new username.");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
                      }
}
