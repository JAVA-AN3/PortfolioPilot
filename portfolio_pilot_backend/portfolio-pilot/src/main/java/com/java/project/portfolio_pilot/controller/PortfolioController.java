package com.java.project.portfolio_pilot.controller;

import com.java.project.portfolio_pilot.dto.PortfolioDashboardDTO;
import com.java.project.portfolio_pilot.service.PortfolioService;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/portfolios")
public class PortfolioController {
    
    private final PortfolioService portfolioService;

    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    /**
     * Endpoint to fetch the full dashboard data for the currently logged-in user.
     * GET /api/potfolios
     */
    @GetMapping
    public PortfolioDashboardDTO getMyPortfolio() {
        // Get the username from the Security Context (JWT Token)
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();

        System.out.println("DEBUG: Userul care cere portofoliul este: " + currentUsername);

        // Delegate to service
        return portfolioService.getPortfolioByUser(currentUsername);
    }
}
