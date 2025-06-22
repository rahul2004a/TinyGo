package com.url.shortener.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
public class HealthController {

    private static final Logger logger = LoggerFactory.getLogger(HealthController.class);

    @Autowired
    private RedisTemplate<String, Object> redisTemplate;

    @GetMapping("/redis")
    public ResponseEntity<Map<String, Object>> checkRedisHealth() {
        Map<String, Object> response = new HashMap<>();

        try {
            // Test Redis connection by setting and getting a test key
            String testKey = "health:check";
            String testValue = "OK";

            redisTemplate.opsForValue().set(testKey, testValue);
            Object retrievedValue = redisTemplate.opsForValue().get(testKey);

            boolean isHealthy = testValue.equals(retrievedValue);

            response.put("status", isHealthy ? "UP" : "DOWN");
            response.put("redis_connection", "SUCCESS");
            response.put("test_key_value", retrievedValue);

            // Clean up test key
            redisTemplate.delete(testKey);

            logger.info("Redis health check passed");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            response.put("status", "DOWN");
            response.put("redis_connection", "FAILED");
            response.put("error", e.getMessage());

            logger.error("Redis health check failed: {}", e.getMessage());
            return ResponseEntity.status(503).body(response);
        }
    }

    @GetMapping("/full")
    public ResponseEntity<Map<String, Object>> fullHealthCheck() {
        Map<String, Object> response = new HashMap<>();

        // Check Redis
        try {
            redisTemplate.opsForValue().set("health:full", "OK");
            redisTemplate.delete("health:full");
            response.put("redis", "UP");
        } catch (Exception e) {
            response.put("redis", "DOWN");
            response.put("redis_error", e.getMessage());
        }

        response.put("application", "UP");
        response.put("timestamp", System.currentTimeMillis());

        return ResponseEntity.ok(response);
    }
}
