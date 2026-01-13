package com.java.project.portfolio_pilot.controller;

import com.java.project.portfolio_pilot.dto.PortfolioDashboardDTO;
import com.java.project.portfolio_pilot.service.PortfolioService;
import com.java.project.portfolio_pilot.dto.AddHoldingRequestDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;


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

    /**
     * Endpoint to add a new investment.
     * POST /api/portfolios/holdings
     */
    @PostMapping("/holdings")
    public void addHolding(@RequestBody AddHoldingRequestDTO request) {
        // Get current user
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String currentUsername = authentication.getName();
        
        // Delegate to service
        portfolioService.addHoldingToPortfolio(currentUsername, request);
    }
    
}
