package com.java.project.portfolio_pilot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

/**
 * Data Transfer Object (DTO) for handling responses from the Finnhub Quote API.
 * Maps the cryptic single-letter JSON fields to readable Java properties.
 */
public class FinnhubResponseDTO {

    // 'c' = Current Price
    @JsonProperty("c")
    private BigDecimal currentPrice;

    // 'dp' = Percent Change (Daily)
    @JsonProperty("dp")
    private BigDecimal percentChange;

    // 'h' = High Price of the day
    @JsonProperty("h")
    private BigDecimal highPrice;

    // 'l' = Low Price of the day
    @JsonProperty("l")
    private BigDecimal lowPrice;

    // 'o' = Open Price of the day
    @JsonProperty("o")
    private BigDecimal openPrice;

    // 'pc' = Previous Close Price
    @JsonProperty("pc")
    private BigDecimal previousClose;

    public FinnhubResponseDTO() {
    }

    // --- Getters & Setters ---

    public BigDecimal getCurrentPrice() { return currentPrice; }
    public void setCurrentPrice(BigDecimal currentPrice) { this.currentPrice = currentPrice; }

    public BigDecimal getPercentChange() { return percentChange; }
    public void setPercentChange(BigDecimal percentChange) { this.percentChange = percentChange; }

    public BigDecimal getHighPrice() { return highPrice; }
    public void setHighPrice(BigDecimal highPrice) { this.highPrice = highPrice; }

    public BigDecimal getLowPrice() { return lowPrice; }
    public void setLowPrice(BigDecimal lowPrice) { this.lowPrice = lowPrice; }

    public BigDecimal getOpenPrice() { return openPrice; }
    public void setOpenPrice(BigDecimal openPrice) { this.openPrice = openPrice; }

    public BigDecimal getPreviousClose() { return previousClose; }
    public void setPreviousClose(BigDecimal previousClose) { this.previousClose = previousClose; }
}