package com.java.project.portfolio_pilot.repository;

import com.java.project.portfolio_pilot.model.Portfolio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    // Find all portfolios belonging to a specific user ID.
    // SQL equivalent: SELECT * FROM portfolios WHERE user_id = ?
    List<Portfolio> findByUserId(Long userId);
}