package com.java.project.portfolio_pilot.dto;

import java.math.BigDecimal;

/**
 * DTO for partial updates to a holding.
 * We use wrapper classes (Integer, BigDecimal) instead of primitives (int, double)
 * so that null values can indicate fields that should NOT be updated.
 */
public class UpdateHoldingDTO {
    private Integer quantity;
    private BigDecimal averagePrice;

    // Getters & Setters
    public Integer getQuantity() { return quantity; }
    public void setQuantity(Integer quantity) { this.quantity = quantity; }
    public BigDecimal getAveragePrice() { return averagePrice; }
    public void setAveragePrice(BigDecimal averagePrice) { this.averagePrice = averagePrice; }
}
