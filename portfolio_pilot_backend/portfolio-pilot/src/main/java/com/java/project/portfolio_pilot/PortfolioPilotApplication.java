package com.java.project.portfolio_pilot;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.context.annotation.Bean;
import org.springframework.web.client.RestTemplate;

@SpringBootApplication
@EnableScheduling
public class PortfolioPilotApplication {

	public static void main(String[] args) {
		SpringApplication.run(PortfolioPilotApplication.class, args);
	}

	/**
	 * Configures a RestTemplate bean to be managed by the Spring Container.
	 * 
	 * RestTemplate is a synchronous client used to perform HTTP requests. By defining it as a @Bean,
	 * we can inject this single instance (Singleton) into any service that needs to communicate 
	 * with external APIs, rather than instantiating a new RestTemplate every time.
	 * 
	 * @return a new instance of RestTemplate
	 */
	@Bean
	public RestTemplate restTemplate() {
		return new RestTemplate();
	}
}

