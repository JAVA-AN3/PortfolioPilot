package com.java.project.portfolio_pilot.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    // 1. Define the encryption tool as a Bean
    // This allows us to inject it into UserService later
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    // 2. Configure HTTP security
    // WARNING: For now, we allow all access (permitAll) and disable CSRF
    // to facilitate testing with Postman. This configuration should be changed for production.
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // Disable CSRF protection for testing purposes
            .authorizeHttpRequests(auth -> auth
            .anyRequest().permitAll() // Allow all requests without authentication
            );
        
        return http.build();
    }
}