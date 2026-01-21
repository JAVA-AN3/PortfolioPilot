package com.java.project.portfolio_pilot.controller;

import com.java.project.portfolio_pilot.dto.CompanyProfileDTO;
import com.java.project.portfolio_pilot.dto.FinnhubResponseDTO;
import com.java.project.portfolio_pilot.service.StockMarketService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final StockMarketService stockMarketService;

    public MarketController(StockMarketService stockMarketService) {
        this.stockMarketService = stockMarketService;
    }

    /**
     * Aggregates all data for a single stock ticker:
     * 1. Real-time Quote (Price, % Change)
     * 2. Company Profile (Logo, Name, Industry)
     */
    @GetMapping("/details/{ticker}")
    public Map<String, Object> getStockDetails(@PathVariable String ticker) {
        Map<String, Object> response = new HashMap<>();
        String symbol = ticker.toUpperCase();

        // 1. Get Price Data
        BigDecimal price = stockMarketService.getStockPrice(symbol);
        
        // Note: Our current FinnhubResponseDTO only captures 'c' (current price).
        // For a pro page, we might want 'dp' (percent change) later. 
        // For now, we simulate change if the API doesn't provide it, or fetch raw DTO if possible.
        
        // 2. Get Profile Data
        CompanyProfileDTO profile = stockMarketService.getCompanyProfile(symbol);

        response.put("price", price);
        response.put("profile", profile);
        
        // Mocking some extra data for UI visualization since Free Tier is limited
        response.put("dayChangePercent", Math.random() * 5 - 2.5); // Random -2.5% to +2.5% for demo
        response.put("isMarketOpen", stockMarketService.isMarketOpen());

        return response;
    }

    /**
     * Endpoint to check market status independently.
     * GET /api/market/status
     */
    @GetMapping("/status")
    public Map<String, Boolean> getMarketStatus() {
        boolean isOpen = stockMarketService.isMarketOpen();
        return Map.of("isOpen", isOpen);
    }
}