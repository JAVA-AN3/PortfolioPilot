package com.java.project.portfolio_pilot.repository;

import com.java.project.portfolio_pilot.model.TickerTapeItem;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TickerTapeRepository extends JpaRepository<TickerTapeItem, Long> {
    Optional<TickerTapeItem> findBySymbol(String symbol);
}