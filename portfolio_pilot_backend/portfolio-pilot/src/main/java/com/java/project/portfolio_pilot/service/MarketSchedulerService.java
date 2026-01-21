package com.java.project.portfolio_pilot.service;

import com.java.project.portfolio_pilot.dto.FinnhubResponseDTO;
import com.java.project.portfolio_pilot.model.TickerTapeItem;
import com.java.project.portfolio_pilot.repository.TickerTapeRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestTemplate;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

/**
 * Service dedicated to background tasks and cron jobs.
 * Responsible for maintaining the 'Ticker Tape' data cache to ensure
 * the frontend has data without exhausting external API rate limits.
 */
@Service
public class MarketSchedulerService {

    private static final Logger logger = LoggerFactory.getLogger(MarketSchedulerService.class);

    private final TickerTapeRepository repository;
    private final RestTemplate restTemplate;

    @Value("${finnhub.api.url}")
    private String apiUrl;

    @Value("${finnhub.api.key}")
    private String apiKey;

    // List of major indices and popular assets to track
    // SPY (S&P 500), DIA (Dow Jones), QQQ (Nasdaq), BTC (Bitcoin), etc.
    private static final List<String> TRACKED_SYMBOLS = Arrays.asList(
            "SPY", "DIA", "IBM", "AAPL", "MSFT", "TSLA", "NVDA", "GOOGL", "AMZN", "META");

    public MarketSchedulerService(TickerTapeRepository repository, RestTemplate restTemplate) {
        this.repository = repository;
        this.restTemplate = restTemplate;
    }

    /**
     * Scheduled Task: Runs every weekday at 17:00 New York Time (Market Close +
     * buffer).
     * Cron expression format: "sec min hour day month day-of-week"
     * Zone: America/New_York ensures we respect Daylight Savings.
     */
    @Scheduled(cron = "0 0 17 * * MON-FRI", zone = "America/New_York")
    @Transactional
    public void refreshTickerTape() {
        logger.info("Starting scheduled job: Refreshing Ticker Tape data...");

        for (String symbol : TRACKED_SYMBOLS) {
            try {
                fetchAndSaveSymbol(symbol);
                // Sleep specifically to avoid hitting Finnhub's rate limit (max 60 calls/min)
                // 1 second pause between calls is safe.
                Thread.sleep(1500);
            } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
            } catch (Exception e) {
                logger.error("Failed to update ticker tape for symbol: {}", symbol, e);
            }
        }

        logger.info("Scheduled job completed. Ticker Tape updated.");
    }

    /**
     * Helper method to fetch a single symbol and update/create the record in DB.
     */
    private void fetchAndSaveSymbol(String symbol) {
        String url = apiUrl + "?symbol=" + symbol + "&token=" + apiKey;
        FinnhubResponseDTO response = restTemplate.getForObject(url, FinnhubResponseDTO.class);

        if (response != null && response.getCurrentPrice() != null) {
            // Check if exists
            Optional<TickerTapeItem> existingItem = repository.findBySymbol(symbol);

            TickerTapeItem item;
            if (existingItem.isPresent()) {
                item = existingItem.get();
                item.setPrice(response.getCurrentPrice());
                // Note: The basic quote endpoint gives 'dp' (percent change).
                // Ensure your FinnhubResponseDTO maps 'dp' if available, otherwise mock or
                // calculate.
                item.setChangePercent(
                        response.getPercentChange() != null ? response.getPercentChange().doubleValue() : 0.0);
            } else {
                item = new TickerTapeItem(
                        symbol,
                        response.getCurrentPrice(),
                        response.getPercentChange() != null ? response.getPercentChange().doubleValue() : 0.0);
            }

            item.setLastUpdated(java.time.LocalDateTime.now());
            repository.save(item);
            logger.debug("Updated: {}", symbol);
        }
    }

    /**
     * Public method to allow manual trigger (e.g. from an Admin Controller or
     * startup)
     */
    public void forceRefresh() {
        refreshTickerTape();
    }
}