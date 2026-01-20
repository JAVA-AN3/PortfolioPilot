package com.java.project.portfolio_pilot.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

/**
 * DTO mapping for Finnhub's "Company Profile 2" endpoint.
 * Captures static data about the company (Logo, Sector, Market Cap).
 */
public class CompanyProfileDTO {
    
    @JsonProperty("name")
    private String name;

    @JsonProperty("ticker")
    private String ticker;

    @JsonProperty("finnhubIndustry")
    private String industry;

    @JsonProperty("logo")
    private String logoUrl;

    @JsonProperty("marketCapitalization")
    private BigDecimal marketCap;

    @JsonProperty("weburl")
    private String website;

    // --- Getters & Setters ---
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getTicker() { return ticker; }
    public void setTicker(String ticker) { this.ticker = ticker; }

    public String getIndustry() { return industry; }
    public void setIndustry(String industry) { this.industry = industry; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public BigDecimal getMarketCap() { return marketCap; }
    public void setMarketCap(BigDecimal marketCap) { this.marketCap = marketCap; }

    public String getWebsite() { return website; }
    public void setWebsite(String website) { this.website = website; }
}