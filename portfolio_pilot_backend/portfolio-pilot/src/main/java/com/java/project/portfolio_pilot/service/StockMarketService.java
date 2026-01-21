package com.java.project.portfolio_pilot.service;

import java.time.DayOfWeek;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.LocalTime;
import java.util.Set;
import java.time.LocalDate;
import java.time.Month;
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

    // Injecting configuration values from application.properties for flexibility
    // and security
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
     * @return The current price as a BigDecimal, or BigDecimal.ZERO if the fetch
     *         fails.
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
            // Log the error and return a fallback value to prevent cascading failures in
            // the calling service.
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
     * Determines if the US Stock Market (NYSE/NASDAQ) is currently open.
     * Logic: Open Mon-Fri, 09:30 AM - 04:00 PM Eastern Time.
     * Excludes Weekends and simple fixed Holidays.
     */
    public boolean isMarketOpen() {
        // 1. Get current time in New York (Wall Street time)
        ZoneId nyZone = ZoneId.of("America/New_York");
        ZonedDateTime now = ZonedDateTime.now(nyZone);

        // 2. Check for Weekend (Saturday or Sunday)
        DayOfWeek day = now.getDayOfWeek();
        if (day == DayOfWeek.SATURDAY || day == DayOfWeek.SUNDAY) {
            return false;
        }

        // 3. Check Trading Hours (09:30 - 16:00)
        LocalTime time = now.toLocalTime();
        LocalTime marketOpen = LocalTime.of(9, 30);
        LocalTime marketClose = LocalTime.of(16, 0);

        if (time.isBefore(marketOpen) || time.isAfter(marketClose)) {
            return false;
        }

        // 4. Check Major Holidays
        // This is a simplified list. For a real production app, use a database table or
        // a dedicated library.
        if (isHoliday(now.toLocalDate())) {
            return false;
        }

        return true;
    }

    /**
     * Simple hardcoded list of major US Market holidays for 2024-2026 logic.
     */
    private boolean isHoliday(LocalDate date) {
        int year = date.getYear();
        Month month = date.getMonth();
        int day = date.getDayOfMonth();

        // New Year's Day (Jan 1)
        if (month == Month.JANUARY && day == 1)
            return true;
        // Independence Day (July 4)
        if (month == Month.JULY && day == 4)
            return true;
        // Christmas (Dec 25)
        if (month == Month.DECEMBER && day == 25)
            return true;

        // Add more logic for floating holidays like Thanksgiving/Labor Day if needed

        return false;
    }
}