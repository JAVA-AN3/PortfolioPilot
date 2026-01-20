package com.java.project.portfolio_pilot.service;

import com.java.project.portfolio_pilot.dto.FinnhubResponseDTO;
import com.java.project.portfolio_pilot.dto.CompanyProfileDTO;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;

/**
 * Service responsible for interacting with external stock market APIs.
 * Currently integrates with Finnhub to retrieve real-time stock quotes.
 */
@Service
public class StockMarketService {

    private final RestTemplate restTemplate;

    // Injecting configuration values from application.properties for flexibility and security
    @Value("${finnhub.api.url}")
    private String apiUrl;

    @Value("${finnhub.api.key}")
    private String apiKey;

    public StockMarketService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    /**
     * Fetches the current stock price for a given ticker symbol.
     *
     * @param symbol The stock ticker symbol (e.g., "AAPL").
     * @return The current price as a BigDecimal, or BigDecimal.ZERO if the fetch fails.
     */
    public BigDecimal getStockPrice(String symbol) {
        // Construct the query URL.
        String finalUrl = apiUrl + "?symbol=" + symbol + "&token=" + apiKey;

        try {
            // Execute the GET request to the external provider
            FinnhubResponseDTO response = restTemplate.getForObject(finalUrl, FinnhubResponseDTO.class);

            if (response != null && response.getCurrentPrice() != null) {
                return response.getCurrentPrice();
            } else {
                throw new RuntimeException("Failed to retrieve price data for symbol: " + symbol);
            }
        } catch (Exception e) {
            // Log the error and return a fallback value to prevent cascading failures in the calling service.
            System.err.println("External API error: " + e.getMessage());
            return BigDecimal.ZERO; 
        }
    }

    /**
     * Fetches company metadata (Logo, Name, Industry).
     * Endpoint: /stock/profile2
     */
    public CompanyProfileDTO getCompanyProfile(String ticker) {
        String url = apiUrl.replace("/quote", "/stock/profile2") + "?symbol=" + ticker + "&token=" + apiKey;
        
        try {
            return restTemplate.getForObject(url, CompanyProfileDTO.class);
        } catch (Exception e) {
            // Log error but don't crash the app; return null or empty profile
            System.err.println("Error fetching profile for " + ticker + ": " + e.getMessage());
            return new CompanyProfileDTO();
        }
    }
    
    /**
     * Checks if the US Market is currently open.
     * Finnhub has a specific endpoint for this, but to save API calls on the free tier,
     * we will determine this via simple TimeZone logic in the Frontend or a Mock here.
     * For "Pro" look, let's return a simple boolean based on server time or a mock.
     */
    public boolean isMarketOpen() {
        // TODO: Implement complex time-zone logic or API call.
        // For now, let's assume it's open for testing purposes.
        return true; 
    }
}