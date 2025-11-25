package com.java.project.portfolio_pilot.repository;

import com.java.project.portfolio_pilot.model.Holding;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoldingRepository extends JpaRepository<Holding, Long> {

    // Find all holdings within a specific portfolio.
    // SQL equivalent: SELECT * FROM holdings WHERE portfolio_id = ?
    List<Holding> findByPortfolioId(Long portfolioId);
}