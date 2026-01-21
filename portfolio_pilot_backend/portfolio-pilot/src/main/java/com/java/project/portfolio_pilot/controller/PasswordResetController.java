package com.java.project.portfolio_pilot.controller;

import com.java.project.portfolio_pilot.model.User;
import com.java.project.portfolio_pilot.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    // 1. STEP 1: REQUEST PASSWORD RESET
    // User enters email -> System generates token -> "Sends" Email
    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody Map<String, String> payload) {
        String email = payload.get("email");
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            // Security Best Practice: Don't reveal if email exists or not.
            // Always return success message.
            return ResponseEntity.ok(Map.of("message", "If an account exists, a reset link has been sent."));
        }

        User user = userOptional.get();
        
        // Generate Token
        String token = UUID.randomUUID().toString();
        user.setResetToken(token);
        user.setResetTokenExpiry(LocalDateTime.now().plusMinutes(30)); // 30 min valability
        userRepository.save(user);

        // --- SIMULATE EMAIL SENDING ---
        // In a real app, use JavaMailSender here.
        String resetLink = "http://localhost:3000/reset-password?token=" + token;
        
        System.out.println("==========================================");
        System.out.println("📧 [MOCK EMAIL] Password Reset Link for: " + email);
        System.out.println("🔗 CLICK HERE: " + resetLink);
        System.out.println("==========================================");

        return ResponseEntity.ok(Map.of("message", "If an account exists, a reset link has been sent."));
    }

    // 2. STEP 2: SUBMIT NEW PASSWORD
    // User submits token + new password
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetPassword(@RequestBody Map<String, String> payload) {
        String token = payload.get("token");
        String newPassword = payload.get("newPassword");

        Optional<User> userOptional = userRepository.findByResetToken(token);

        if (userOptional.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Invalid token."));
        }

        User user = userOptional.get();

        // Check Expiry
        if (user.getResetTokenExpiry().isBefore(LocalDateTime.now())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Token has expired."));
        }

        // Update Password
        user.setPassword(passwordEncoder.encode(newPassword));
        
        // Clear Token (Single use)
        user.setResetToken(null);
        user.setResetTokenExpiry(null);
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password successfully reset. You can now login."));
    }
}