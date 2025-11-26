package com.java.project.portfolio_pilot.security;

import com.java.project.portfolio_pilot.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;
import org.springframework.stereotype.Component;
import java.security.Security;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    // This executes once per request
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. Extracting JWT token from the request header
            String jwt = parseJwt(request);

            // 2. If token is present and valid, proceed to authenticate
            if (jwt != null && validateJwtToken(jwt)) {
                
                // 3. Extract username from token
                String username = jwtUtils.getUserNameFromJwtToken(jwt);

                // 4. Load user details associated with the username
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 5. Create authentication token
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities());
                
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                // 6. Write the authentication info to SecurityContext
                // From now on, Spring Security knows the user is authenticated
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("Cannot set user authentication: {}", e);
        }

        // 7. Continue the filter chain
        filterChain.doFilter(request, response);
    }

    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        // Token comes in format "Bearer <token>"       
        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7); // Extract token part
        }

        return null;
    }
    
    // simple validation method
    private boolean validateJwtToken(String authToken) {
        try {
           
            return jwtUtils.validateJwtToken(authToken); 
        } catch (Exception e) {
            return false;
        }
    }
}