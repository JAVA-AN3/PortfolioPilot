package com.java.project.portfolio_pilot.dto;

import java.math.BigDecimal;

/**
 * DTO for partial updates to a holding.
 */
public class UpdateHoldingDTO {
    private BigDecimal quantity;
    private BigDecimal averagePrice;

    // Getters & Setters
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    public BigDecimal getAveragePrice() { return averagePrice; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }
}
