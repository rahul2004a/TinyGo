package com.url.shortener.config;

import com.url.shortener.service.RateLimiterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

@Configuration
@EnableScheduling
public class SchedulingConfig {

    @Autowired
    private RateLimiterService rateLimiterService;

    @Scheduled(fixedRate = 120000) // 2 minutes = 120,000 milliseconds
    public void cleanupExpiredRateLimitLogs() {
        rateLimiterService.cleanupExpiredLogs();
    }
}
