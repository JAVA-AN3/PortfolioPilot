package com.java.project.portfolio_pilot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

/**
 * Data Transfer Object (DTO) for handling responses from the Finnhub API.
 * 
 * We use DTOs to decouple our internal domain model from external API structures.
 * This prevents changes in the external API from breaking our core logic directly.
 */
public class FinnhubResponseDTO {

    /**
     * The current price of the stock.
     * 
     * The Finnhub API returns this data in a field named simply "c".
     * While concise, "c" is not descriptive for our codebase.
     * 
     * We use the {@code @JsonProperty("c")} annotation to tell the Jackson library:
     * "When you see 'c' in the incoming JSON, map it to this 'currentPrice' variable."
     */
    @JsonProperty("c")
    private BigDecimal currentPrice;

    public FinnhubResponseDTO() {
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
}