package com.java.project.portfolio_pilot.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;

@Component
public class JwtUtils {

    // This is the "Secret Key" used to sign the tokens.
    // In a production environment, this should NOT be hardcoded. It should be stored in environment variables or a secrets manager.
    // It must be sufficiently long (min 256 bits) for the HS256 algorithm.
    private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Token validity: 24 hours (in milliseconds)
    private final int jwtExpirationMs = 86400000;

    public String generateToken(String username) {
        return Jwts.builder()
                .setSubject(username) // Who is this token for?
                .setIssuedAt(new Date()) // When was it created?
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs)) // When does it expire?
                .signWith(key) // Digital signature
                .compact();
    }
}