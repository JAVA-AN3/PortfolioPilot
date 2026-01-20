package com.java.project.portfolio_pilot.dto;

import java.math.BigDecimal;

/**
 * Data Transfer Object representing a single holding's performance.
 * This object is computed by the backend and sent to the frontend for display.
 */

public class HoldingDTO {
    
    private Long id;
    private String ticker;
    private Integer quantity;
    private BigDecimal averagePrice;
    private BigDecimal currentPrice;
    private BigDecimal marketValue;
    private BigDecimal totalProfitLoss;
    private BigDecimal profitLossPercentage;
    private BigDecimal allocation;
    private String warning;

    // Constructor, Getters and Setters
    public HoldingDTO(Long id,String ticker, Integer quantity, BigDecimal averagePrice) {
        this.id = id;
        this.ticker = ticker;
        this.quantity = quantity;
        this.averagePrice = averagePrice;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getAveragePrice() { return averagePrice; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }
    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }
    public BigDecimal getMarketValue() { return marketValue; }
    public void setMarketValue(BigDecimal marketValue) { this.marketValue = marketValue; }
    public BigDecimal getTotalProfitLoss() { return totalProfitLoss; }
    public void setTotalProfitLoss(BigDecimal totalProfitLoss) { this.totalProfitLoss = totalProfitLoss; }
    public BigDecimal getProfitLossPercentage() { return profitLossPercentage; }
    public void setProfitLossPercentage(BigDecimal profitLossPercentage) { this.profitLossPercentage = profitLossPercentage; }
    public BigDecimal getAllocation() { return allocation; }
    public void setAllocation(BigDecimal allocation) { this.allocation = allocation; }
    public String getWarning() { return warning; }
    public void setWarning(String warning) { this.warning = warning; }
}
