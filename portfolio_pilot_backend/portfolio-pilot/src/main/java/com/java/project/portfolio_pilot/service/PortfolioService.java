package com.java.project.portfolio_pilot.service;

import com.java.project.portfolio_pilot.dto.AddHoldingRequestDTO;
import com.java.project.portfolio_pilot.dto.HoldingDTO;
import com.java.project.portfolio_pilot.dto.PortfolioDashboardDTO;
import com.java.project.portfolio_pilot.dto.UpdateHoldingDTO;
import com.java.project.portfolio_pilot.model.Holding;
import com.java.project.portfolio_pilot.model.Portfolio;
import com.java.project.portfolio_pilot.model.User;
import com.java.project.portfolio_pilot.repository.HoldingRepository;
import com.java.project.portfolio_pilot.repository.PortfolioRepository;
import com.java.project.portfolio_pilot.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;

/**
 * Service orchestrating the business logic for portfolio management.
 * It aggregates data from the database and external stock APIs to compute
 * real-time performance metrics.
 */
@Service
public class PortfolioService {

    private static final Logger logger = LoggerFactory.getLogger(PortfolioService.class);

    private final PortfolioRepository portfolioRepository;
    private final HoldingRepository holdingRepository;
    private final UserRepository userRepository;
    private final StockMarketService stockMarketService;

    public PortfolioService(PortfolioRepository portfolioRepository,
            HoldingRepository holdingRepository,
            UserRepository userRepository,
            StockMarketService stockMarketService) {
        this.portfolioRepository = portfolioRepository;
        this.holdingRepository = holdingRepository;
        this.userRepository = userRepository;
        this.stockMarketService = stockMarketService;
    }

    /**
     * Retrieves or creates the default portfolio for a specific user.
     * Currently assumes a 1-to-1 relationship between User and Portfolio.
     */
    @Transactional
    public PortfolioDashboardDTO getPortfolioByUser(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Retrieve existing portfolio or create a new empty one if first login
        Portfolio portfolio = portfolioRepository.findByUserId(user.getId())
                .stream()
                .findFirst()
                .orElseGet(() -> createNewPortfolio(user));

        List<Holding> entities = holdingRepository.findByPortfolioId(portfolio.getId());

        // Transform Entities into DTOs with calculations
        return calculatePortfolioMetrics(entities);
    }

    /**
     * Helper method to create a portfolio for new users.
     */
    private Portfolio createNewPortfolio(User user) {
        logger.info("Creating new default portfolio for user: {}", user.getUsername());
        Portfolio p = new Portfolio();
        p.setUser(user);
        p.setName("My First Portfolio");
        return portfolioRepository.save(p);
    }

    /**
     * Core business logic
     * 1. Fetches real-time price.
     * 2. Calculates market value, P/L for each holding.
     * 3. Aggregates totals.
     */
    private PortfolioDashboardDTO calculatePortfolioMetrics(List<Holding> holdings) {
        PortfolioDashboardDTO dashboard = new PortfolioDashboardDTO();
        List<HoldingDTO> holdingDTOs = new ArrayList<>();

        BigDecimal totalMarketValue = BigDecimal.ZERO;
        BigDecimal totalInvested = BigDecimal.ZERO;

        // 1. Individual holding calculation
        for (Holding h : holdings) {
            HoldingDTO dto = new HoldingDTO(h.getId(), h.getStockTicker(), h.getQuantity(), h.getAverageBuyPrice());

            // Fetches live price (external API call)
            BigDecimal currentPrice = stockMarketService.getStockPrice(h.getStockTicker());

            if (currentPrice.compareTo(BigDecimal.ZERO) == 0) {
                logger.warn("Failed to fetch price for ticker: {}. Using buy price as fallback.", h.getStockTicker());
                currentPrice = h.getAverageBuyPrice();
                dto.setWarning("Live price unavailable. Using purchase price.");
            }

            dto.setCurrentPrice(currentPrice);

            // Calculates market value = qty * current price
            BigDecimal marketValue = currentPrice.multiply(h.getQuantity());
            dto.setMarketValue(marketValue);

            // Calculates invested amount = qty * avg price
            BigDecimal invested = h.getAverageBuyPrice().multiply(h.getQuantity());

            // Calculates P/L ($) = market value - invested
            dto.setTotalProfitLoss(marketValue.subtract(invested));

            // Calculates P/L (%) = (P/L / invested) * 100
            if (invested.compareTo(BigDecimal.ZERO) > 0) {
                BigDecimal profitPercent = dto.getTotalProfitLoss()
                        .divide(invested, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
                dto.setProfitLossPercentage(profitPercent);
            } else {
                dto.setProfitLossPercentage(BigDecimal.ZERO);
            }

            // Add to totals
            totalMarketValue = totalMarketValue.add(marketValue);
            totalInvested = totalInvested.add(invested);

            holdingDTOs.add(dto);
        }

        // 2. Portfolio allocations
        // The allocation % can ve calulated only after we know the total market value
        if (totalMarketValue.compareTo(BigDecimal.ZERO) > 0) {
            for (HoldingDTO dto : holdingDTOs) {
                BigDecimal allocation = dto.getMarketValue()
                        .divide(totalMarketValue, 4, RoundingMode.HALF_UP)
                        .multiply(BigDecimal.valueOf(100));
                dto.setAllocation(allocation);
            }
        }

        // 3. Final aggregation
        dashboard.setHoldings(holdingDTOs);
        dashboard.setTotalBalance(totalMarketValue);
        dashboard.setTotalInvested(totalInvested);
        dashboard.setTotalProfit(totalMarketValue.subtract(totalInvested));

        if (totalInvested.compareTo(BigDecimal.ZERO) > 0) {
            BigDecimal totalProfitPercent = dashboard.getTotalProfit()
                    .divide(totalInvested, 4, RoundingMode.HALF_UP)
                    .multiply(BigDecimal.valueOf(100));
            dashboard.setTotalProfitPercentage(totalProfitPercent);
        }

        return dashboard;
    }

    /**
     * Adds a new stock holding to the user's portfolio.
     */
    @Transactional
    public void addHoldingToPortfolio(String username, AddHoldingRequestDTO request) {
        // Identify the user
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Find user portfolio (create if missing, though it should exist by now)
        Portfolio portfolio = portfolioRepository.findByUserId(user.getId())
                .stream()
                .findFirst()
                .orElseGet(() -> createNewPortfolio(user));

        // Create the new Holding entity
        Holding newHolding = new Holding();
        newHolding.setStockTicker(request.getTicker().toUpperCase());
        newHolding.setQuantity(request.getQuantity());
        newHolding.setAverageBuyPrice(request.getPrice());
        newHolding.setPortfolio(portfolio);

        // Save to database
        holdingRepository.save(newHolding);

        logger.info("Successfully added {} shares of {} to user {}'s portfolio",
                request.getQuantity(), request.getTicker(), username);
    }

    /**
     * Updates an existing holding.
     * Implements a "partial update" strategy: only non-null fields from the DTO
     * are applied to the entity. This allows the frontend to update just the
     * quantity
     * without sending the price, or vice-versa.
     * * @param holdingId The ID of the holding to update
     * 
     * @param request The data to update
     */
    @Transactional
    public void updateHolding(Long holdingId, UpdateHoldingDTO request) {
        Holding holding = holdingRepository.findById(holdingId)
                .orElseThrow(() -> new RuntimeException("Holding not found"));

        // Update only if values are provided (not null)
        if (request.getQuantity() != null)
            holding.setQuantity(request.getQuantity());
        if (request.getAveragePrice() != null)
            holding.setAverageBuyPrice(request.getAveragePrice());

        holdingRepository.save(holding);
    }

    /**
     * Hard deletes a holding from the database.
     * * @param holdingId The ID of the holding to remove
     */
    @Transactional
    public void deleteHolding(Long holdingId) {
        if (!holdingRepository.existsById(holdingId)) {
            throw new RuntimeException("Holding not found");
        }
        holdingRepository.deleteById(holdingId);
    }
}
