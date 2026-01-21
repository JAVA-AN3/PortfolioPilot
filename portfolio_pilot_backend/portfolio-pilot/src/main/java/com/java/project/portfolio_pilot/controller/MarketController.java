package com.java.project.portfolio_pilot.controller;

import com.java.project.portfolio_pilot.dto.CompanyProfileDTO;
import com.java.project.portfolio_pilot.dto.FinnhubResponseDTO;
import com.java.project.portfolio_pilot.dto.FinnhubResponseDTO;
import com.java.project.portfolio_pilot.repository.TickerTapeRepository;
import com.java.project.portfolio_pilot.service.MarketSchedulerService;
import com.java.project.portfolio_pilot.service.StockMarketService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * REST Controller for Market Research Data.
 * Serves real-time quotes and company profiles, while leveraging a local database cache 
 * for high-frequency Ticker Tape requests.
 */
@RestController
@RequestMapping("/api/market")
public class MarketController {

    private final StockMarketService stockMarketService;
    private final TickerTapeRepository tickerTapeRepository;
    private final MarketSchedulerService marketSchedulerService;

    public MarketController(
            StockMarketService stockMarketService,
            TickerTapeRepository tickerTapeRepository,
            MarketSchedulerService marketSchedulerService) {
        this.stockMarketService = stockMarketService;
        this.tickerTapeRepository = tickerTapeRepository;
        this.marketSchedulerService = marketSchedulerService;
    }

    /**
     * Aggregates essential data for a single stock ticker.
     * Uses a Hybrid Strategy:
     * - Real Data: Price, Profile, Market Status.
     * - Mocked Data: Intraday Chart/Change (handled by Frontend/Response) to bypass API limits.
     * * @param ticker The symbol to analyze (e.g., AAPL).
     * @return JSON map containing Quote and Profile.
     */
    @GetMapping("/details/{ticker}")
    public Map<String, Object> getStockDetails(@PathVariable String ticker) {
        Map<String, Object> response = new HashMap<>();
        String symbol = ticker.toUpperCase();

        // 1. Fetch Real-time Quote (Includes High, Low, Open, Change)
        FinnhubResponseDTO quote = stockMarketService.getStockQuote(symbol);
        
        // 2. Fetch Company Metadata (Live from Finnhub)
        CompanyProfileDTO profile = stockMarketService.getCompanyProfile(symbol);

        // 3. Map Real Data to Response
        if (quote != null) {
            response.put("price", quote.getCurrentPrice());
            response.put("changePercent", quote.getPercentChange()); // REAL %
            response.put("high", quote.getHighPrice());              // REAL High
            response.put("low", quote.getLowPrice());                // REAL Low
            response.put("open", quote.getOpenPrice());              // REAL Open
            response.put("prevClose", quote.getPreviousClose());     // REAL Prev Close
        }

        response.put("profile", profile);
        
        // 4. Real Market Status
        response.put("isMarketOpen", stockMarketService.isMarketOpen());

        return response;
    }

    /**
     * Endpoint to check market status independently.
     * Useful for the UI badge in the header.
     */
    @GetMapping("/status")
    public Map<String, Boolean> getMarketStatus() {
        return Map.of("isOpen", stockMarketService.isMarketOpen());
    }

    /**
     * Retrieves the cached ticker tape data from the database.
     * Strategy: Read-Through Cache.
     * If DB is empty (first run), triggers an async background refresh job.
     */
    @GetMapping("/ticker-tape")
    public List<com.java.project.portfolio_pilot.model.TickerTapeItem> getTickerTape() {
        List<com.java.project.portfolio_pilot.model.TickerTapeItem> items = tickerTapeRepository.findAll();
        
        // Self-Healing: If cache is empty, trigger the scheduler manually
        if (items.isEmpty()) {
            new Thread(marketSchedulerService::forceRefresh).start();
        }
        
        return items;
    }
}