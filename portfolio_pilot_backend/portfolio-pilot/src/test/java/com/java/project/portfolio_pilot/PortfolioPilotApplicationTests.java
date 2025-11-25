package com.java.project.portfolio_pilot;

import com.java.project.portfolio_pilot.service.StockMarketService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import java.math.BigDecimal;

// Importurile pentru verificari (Assertions)
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

@SpringBootTest // 1. Asta ii spune Java: "Porneste tot Spring-ul ca sa pot testa real"
class PortfolioPilotApplicationTests {

    // 2. Injectam serviciul pe care vrem sa il testam
    // Spring il cauta in 'main' si il aduce aici.
    @Autowired
    private StockMarketService stockMarketService;

    @Test // 3. Aceasta este eticheta care transforma metoda intr-un buton de "Run Test"
    void testStockMarketIntegration() {
        System.out.println("--- START TEST: Verificare API Finnhub ---");

        // Pasul A: Definim scenariul
        String simbolBursa = "AAPL"; // Apple Inc.

        // Pasul B: Executam actiunea (apelam metoda facuta de tine)
        // Daca nu ai pus API KEY in settings.json, aici va crapa!
        BigDecimal pret = stockMarketService.getStockPrice(simbolBursa);

        // Pasul C: Afisam rezultatul in consola (optional, doar ca sa vezi tu)
        System.out.println("Pretul primit pentru " + simbolBursa + " este: " + pret + " USD");

        // Pasul D: VERIFICAREA (Partea cea mai importanta)
        // Daca pretul este null, testul pica (se face rosu).
        assertNotNull(pret, "Eroare: Pretul a venit NULL! Verifica API Key.");
        
        // Daca pretul e 0 sau negativ, testul pica.
        assertTrue(pret.compareTo(BigDecimal.ZERO) > 0, "Eroare: Pretul trebuie sa fie mai mare ca 0.");

        System.out.println("--- TEST PASSED: Totul functioneaza corect ---");
    }
}