package com.java.project.portfolio_pilot.dto;

import java.math.BigDecimal;
import java.util.List;

/**
 * Composite DTO that aggregates the entire portfolio state.
 * Contains both high-level summaries (Total Balance) and detailed breakdowns (List of Holdings).
 */
public class PortfolioDashboardDTO {

    private BigDecimal totalBalance;
    private BigDecimal totalInvested;
    private BigDecimal totalProfit;
    private BigDecimal totalProfitPercentage;
    
    // The list of individual stocks (The "Spreadsheet rows")
    private List<HoldingDTO> holdings;

    public PortfolioDashboardDTO() {
        this.totalBalance = BigDecimal.ZERO;
        this.totalInvested = BigDecimal.ZERO;
        this.totalProfit = BigDecimal.ZERO;
        this.totalProfitPercentage = BigDecimal.ZERO;
    }

    // --- Getters and Setters ---
    public BigDecimal getTotalBalance() { return totalBalance; }
    public void setTotalBalance(BigDecimal totalBalance) { this.totalBalance = totalBalance; }
    public BigDecimal getTotalInvested() { return totalInvested; }
    public void setTotalInvested(BigDecimal totalInvested) { this.totalInvested = totalInvested; }
    public BigDecimal getTotalProfit() { return totalProfit; }
    public void setTotalProfit(BigDecimal totalProfit) { this.totalProfit = totalProfit; }
    public BigDecimal getTotalProfitPercentage() { return totalProfitPercentage; }
    public void setTotalProfitPercentage(BigDecimal totalProfitPercentage) { this.totalProfitPercentage = totalProfitPercentage; }
    public List<HoldingDTO> getHoldings() { return holdings; }
    public void setHoldings(List<HoldingDTO> holdings) { this.holdings = holdings; }
}
