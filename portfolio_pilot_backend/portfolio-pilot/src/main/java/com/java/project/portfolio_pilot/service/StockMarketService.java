package com.java.project.portfolio_pilot.service;

import com.java.project.portfolio_pilot.dto.FinnhubResponseDTO;
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
}