package com.java.project.portfolio_pilot.controller;

import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.java.project.portfolio_pilot.dto.LoginRequestDTO;
import com.java.project.portfolio_pilot.dto.UserRegistrationDTO;
import com.java.project.portfolio_pilot.model.User;
import com.java.project.portfolio_pilot.repository.UserRepository;
import com.java.project.portfolio_pilot.security.JwtUtils;
import com.java.project.portfolio_pilot.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtils jwtUtils;

    public AuthController(UserService userService, UserRepository userRepository, 
                          PasswordEncoder passwordEncoder, JwtUtils jwtUtils) {
        this.userService = userService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtils = jwtUtils;
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

    /**
     * Authenticates a user and issues a JWT token.
     *
     * @param loginRequest The login credentials.
     * @return A JWT token if authentication is successful, or 401 Unauthorized otherwise.
     */
    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody LoginRequestDTO loginRequest) {
        // Retrieve user by username to verify existence
        Optional<User> userOptional = userRepository.findByUsername(loginRequest.getUsername());

        // Validate credentials: user must exist and password hash must match
        if (userOptional.isPresent() && 
            passwordEncoder.matches(loginRequest.getPassword(), userOptional.get().getPassword())) {
            
            // Generate JWT token for the authenticated session
            String token = jwtUtils.generateToken(userOptional.get().getUsername());
            
            return ResponseEntity.ok(token);
        }

        return ResponseEntity.status(401).body("Invalid username or password");
    }
}
