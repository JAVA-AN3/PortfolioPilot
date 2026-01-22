package com.java.project.portfolio_pilot.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.java.project.portfolio_pilot.security.JwtAuthenticationFilter;
import com.java.project.portfolio_pilot.security.services.UserDetailsServiceImpl;

/**
 * Main Security Configuration for the Portfolio Pilot Application.
 * This class configures the security filter chain, CORS settings, and authentication providers.
 * It enforces Stateless Session management suitable for JWT-based architectures.
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthenticationFilter;
    private final UserDetailsServiceImpl userDetailsService;

    // Constructor injection for required dependencies
    public SecurityConfig(JwtAuthenticationFilter jwtAuthenticationFilter,
                          UserDetailsServiceImpl userDetailsService) {
        this.jwtAuthenticationFilter = jwtAuthenticationFilter;
        this.userDetailsService = userDetailsService;
    }

    /**
     * Defines the password hashing algorithm.
     * BCrypt is the industry standard for secure password storage.
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Configures the Data Access Object (DAO) Authentication Provider.
     * This provider connects the security context with our custom UserDetailsService
     * and the PasswordEncoder to verify user credentials.
     */
    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Exposes the AuthenticationManager as a Bean.
     * This is required by the AuthController to programmatically trigger authentication.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    /**
     * The core Security Filter Chain definition.
     * Configures HTTP security, CORS, CSRF, and route protection rules.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Disable CSRF (Cross-Site Request Forgery) as we are using stateless JWTs, not browser sessions
            .csrf(csrf -> csrf.disable())
            // Enable CORS (Cross-Origin Resource Sharing) using the configuration defined below
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // Define authorization rules for specific HTTP endpoints
            .authorizeHttpRequests(auth -> auth
                // Allow unauthenticated access to Auth endpoints (Login/Register)
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()

                // Allow unauthenticated access to Password Reset endpoints (Forgot/Reset)
                .requestMatchers("/api/auth/forgot-password", "/api/auth/reset-password").permitAll()
                
                // Require authentication for Market Research endpoints
                .requestMatchers("/api/market/**").authenticated()
                
                // Require authentication for Portfolio Management endpoints
                .requestMatchers("/api/portfolios/**").authenticated()
                
                // Lock down all other endpoints by default
                .anyRequest().authenticated()
            )
            
            // Set session management to STATELESS (Server will not create a session ID)
            .sessionManagement(sess -> sess.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            
            // Register the authentication provider
            .authenticationProvider(authenticationProvider())
            
            // Insert our custom JWT Filter before the standard UsernamePasswordAuthenticationFilter
            // This ensures tokens are checked before the request reaches the controllers
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configuration for Cross-Origin Resource Sharing (CORS).
     * Explicitly allows the React Frontend (localhost:3000) to communicate with this Backend.
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        
        // Allow requests from the frontend development server
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        
        // Allow standard REST methods
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        
        // Allow all headers (Authorization, Content-Type, etc.)
        configuration.setAllowedHeaders(List.of("*"));
        
        // Allow credentials (cookies/auth headers) to be exposed to the client
        configuration.setAllowCredentials(true);

        // Apply this configuration to all routes in the application
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}