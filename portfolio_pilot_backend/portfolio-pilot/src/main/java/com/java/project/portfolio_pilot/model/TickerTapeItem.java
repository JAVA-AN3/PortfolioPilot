package com.java.project.portfolio_pilot.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Entity representing a snapshot of a major index or popular stock.
 * Used for the scrolling ticker tape to avoid real-time API rate limits.
 * Data is refreshed daily via a scheduled job.
 */
@Entity
@Table(name = "ticker_tape_items")
public class TickerTapeItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String symbol; // e.g., SPY, AAPL

    private BigDecimal price;

    @Column(name = "change_percent")
    private Double changePercent;

    private LocalDateTime lastUpdated;

    // --- Constructors ---
    public TickerTapeItem() {}

    public TickerTapeItem(String symbol, BigDecimal price, Double changePercent) {
        this.symbol = symbol;
        this.price = price;
        this.changePercent = changePercent;
        this.lastUpdated = LocalDateTime.now();
    }

    // --- Getters & Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getSymbol() { return symbol; }
    public void setSymbol(String symbol) { this.symbol = symbol; }

    public BigDecimal getPrice() { return price; }
    public void setPrice(BigDecimal price) { this.price = price; }

    public Double getChangePercent() { return changePercent; }
    public void setChangePercent(Double changePercent) { this.changePercent = changePercent; }

    public LocalDateTime getLastUpdated() { return lastUpdated; }
    public void setLastUpdated(LocalDateTime lastUpdated) { this.lastUpdated = lastUpdated; }
}