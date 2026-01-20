package com.java.project.portfolio_pilot.dto;

import java.math.BigDecimal;

/**
 * DTO used to capture user input when adding a new stock to the portfolio.
 * We only need 3 things from the user: ticker, quantity and price.
 */
public class AddHoldingRequestDTO {
    
    private String ticker;
    private BigDecimal quantity;
    private BigDecimal price;

    // --- Getters & Setters ---
    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }
    
    public BigDecimal getQuantity() { return quantity; }
    public void setQuantity(BigDecimal quantity) { this.quantity = quantity; }
    
    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }
}
