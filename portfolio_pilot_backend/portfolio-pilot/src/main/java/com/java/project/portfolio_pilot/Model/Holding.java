package com.java.project.portfolio_pilot.Model;

import java.math.BigDecimal;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Column; // Imported for precise financial calculations
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

@Entity
@Table(name = "holdings")
public class Holding {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String stockTicker; // Ex: AAPL, TSLA, TLV

    @Column(nullable = false)
    private Integer quantity; // Number of shares held

    // Using big decimal for financial values
    // precision=19, scale=4 means max 19 digits, 4 after decimal point
    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal averageBuyPrice;

    // Relationship with Portfolio

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    @JsonIgnore // Prevent circular reference during serialization
    private Portfolio portfolio;

    // Constructors

    public Holding() {
    }

    public Holding(String stockTicker, Integer quantity, BigDecimal averageBuyPrice, Portfolio portfolio) {
        this.stockTicker = stockTicker;
        this.quantity = quantity;
        this.averageBuyPrice = averageBuyPrice;
        this.portfolio = portfolio;
    }

    // --- GETTERS & SETTERS ---

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getStockTicker() {
        return stockTicker;
    }

    public void setStockTicker(String stockTicker) {
        this.stockTicker = stockTicker;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getAverageBuyPrice() {
        return averageBuyPrice;
    }

    public void setAverageBuyPrice(BigDecimal averageBuyPrice) {
        this.averageBuyPrice = averageBuyPrice;
    }

    public Portfolio getPortfolio() {
        return portfolio;
    }

    public void setPortfolio(Portfolio portfolio) {
        this.portfolio = portfolio;
    }
}