package com.java.project.portfolio_pilot.repository;

import com.java.project.portfolio_pilot.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository // Tells Spring: "This is a bean that talks to the DB"
public interface UserRepository extends JpaRepository<User, Long> {

    // Custom query method derived from method name.
    // SQL equivalent: SELECT * FROM users WHERE username = ?
    Optional<User> findByUsername(String username);

    // SQL equivalent: SELECT * FROM users WHERE email = ?
    Optional<User> findByEmail(String email);
    
    // Checks if a user exists (useful for validation during registration)
    boolean existsByUsername(String username);
    
    boolean existsByEmail(String email);
}