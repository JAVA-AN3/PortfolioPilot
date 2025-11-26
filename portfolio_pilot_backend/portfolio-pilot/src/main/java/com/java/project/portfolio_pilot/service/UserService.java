package com.java.project.portfolio_pilot.service;

import com.java.project.portfolio_pilot.dto.UserRegistrationDTO;
import com.java.project.portfolio_pilot.model.User;
import com.java.project.portfolio_pilot.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

@Service // Essential: Tells Spring this class holds business logic
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Constructor Injection (Best Practice)
    // Spring automatically provides the instance of UserRepository here.
    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Registers a new user based on the provided DTO.
     * @param registrationDTO The data sent by the user (username, email, password)
     * @return The saved User entity
     */
    public User registerUser(UserRegistrationDTO registrationDTO) {
        // 1. Validation: Check if email or username already exists
        if (userRepository.existsByEmail(registrationDTO.getEmail())) {
            throw new RuntimeException("Email already in use!");
        }
        if (userRepository.existsByUsername(registrationDTO.getUsername())) {
            throw new RuntimeException("Username already taken!");
        }

        // 2. Mapping: Convert DTO to Entity
        // We create a new User object because the Repository only accepts Entities.
        User newUser = new User();
        newUser.setUsername(registrationDTO.getUsername());
        newUser.setEmail(registrationDTO.getEmail());
        
        // 3. Encryption
        // We never save the raw password. We save the encoded (hashed) version.
        String encodedPassword = passwordEncoder.encode(registrationDTO.getPassword());
        newUser.setPassword(encodedPassword);

        // 4. Save to Database
        // This is where the magic happens. .save() does the INSERT SQL.
        return userRepository.save(newUser);
    }
}